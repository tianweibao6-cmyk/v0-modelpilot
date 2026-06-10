import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { normalizeMapayQueryUrl, isPaidStatus, sameMoney } from "@/lib/mapay"
import { getProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

/**
 * 订单状态查询（供前端轮询）。
 * 受 RLS 限制，仅能查询当前登录用户本人的订单。
 * 若本地订单尚未标记为 paid，则主动向码支付查询接口确认，
 * 以兜底异步回调未能到达服务器的情况。
 */
export async function GET(request: Request) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "请先登录" }, { status: 401 })
  }

  const outTradeNo = new URL(request.url).searchParams.get("out_trade_no")
  if (!outTradeNo) {
    return NextResponse.json({ error: "缺少订单号" }, { status: 400 })
  }

  const { data: order, error } = await supabase
    .from("orders")
    .select("status, product_type, amount")
    .eq("out_trade_no", outTradeNo)
    .eq("user_id", user.id)
    .maybeSingle()

  if (error || !order) {
    return NextResponse.json({ error: "订单不存在" }, { status: 404 })
  }

  // 本地已是 paid，直接返回
  if (order.status === "paid") {
    return NextResponse.json({
      status: "paid",
      paid: true,
      productType: order.product_type,
    })
  }

  // 本地未支付：主动向码支付查询订单，兜底异步回调未到达的情况
  const pid = process.env.MAPAY_PID
  const key = process.env.MAPAY_KEY
  const apiUrl = process.env.MAPAY_API_URL

  if (pid && key && apiUrl) {
    try {
      const queryUrl = new URL(normalizeMapayQueryUrl(apiUrl))
      queryUrl.searchParams.set("act", "order")
      queryUrl.searchParams.set("pid", pid)
      queryUrl.searchParams.set("key", key)
      queryUrl.searchParams.set("out_trade_no", outTradeNo)

      const res = await fetch(queryUrl.toString(), { method: "GET" })
      const data = await res.json().catch(() => null)

      if (data && isPaidStatus(data)) {
        const product = getProduct(order.product_type)
        // 校验金额：以平台返回 money 与本地价目表比较
        const platformMoney = data.money ?? data.realmoney ?? product?.price
        if (product && sameMoney(platformMoney, product.price)) {
          const admin = createAdminClient()
          await admin
            .from("orders")
            .update({
              status: "paid",
              trade_no: data.trade_no || null,
              paid_at: new Date().toISOString(),
            })
            .eq("out_trade_no", outTradeNo)
            .neq("status", "paid")

          // 完整项目包：激活用户套餐
          if (order.product_type === "project_pack") {
            await admin
              .from("profiles")
              .update({ plan_status: "beta_active" })
              .eq("id", user.id)
          }

          return NextResponse.json({
            status: "paid",
            paid: true,
            productType: order.product_type,
          })
        }
      }
    } catch (e) {
      console.log("[v0] mapay query exception:", (e as Error).message)
    }
  }

  return NextResponse.json({
    status: order.status,
    paid: false,
    productType: order.product_type,
  })
}

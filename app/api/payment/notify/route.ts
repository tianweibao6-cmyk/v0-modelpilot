import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { verifyMapaySign } from "@/lib/mapay"
import { getProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

/**
 * 码支付异步通知回调（GET）。
 * 码支付在用户支付成功后请求此地址，校验通过后必须返回纯文本 "success"，
 * 否则会持续重试。
 */
export async function GET(request: Request) {
  const key = process.env.MAPAY_KEY
  if (!key) return new NextResponse("fail", { status: 200 })

  const url = new URL(request.url)
  const params: Record<string, string> = {}
  url.searchParams.forEach((v, k) => {
    params[k] = v
  })

  // 1. 校验签名
  if (!verifyMapaySign(params, key)) {
    console.log("[v0] notify sign verify failed")
    return new NextResponse("fail", { status: 200 })
  }

  // 2. 仅处理支付成功通知
  if (params.trade_status !== "TRADE_SUCCESS") {
    return new NextResponse("success", { status: 200 })
  }

  const outTradeNo = params.out_trade_no
  if (!outTradeNo) return new NextResponse("fail", { status: 200 })

  const admin = createAdminClient()

  // 3. 查询本地订单
  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("out_trade_no", outTradeNo)
    .maybeSingle()

  if (!order) {
    console.log("[v0] notify order not found:", outTradeNo)
    return new NextResponse("fail", { status: 200 })
  }

  // 幂等：已支付直接返回成功
  if (order.status === "paid") {
    return new NextResponse("success", { status: 200 })
  }

  // 4. 校验金额与商品价目表一致，防止金额篡改
  const product = getProduct(order.product_type)
  const paidMoney = params.money
  if (!product || paidMoney !== product.price) {
    console.log(
      "[v0] notify amount mismatch:",
      paidMoney,
      "expected",
      product?.price,
    )
    return new NextResponse("fail", { status: 200 })
  }

  // 5. 更新订单为已支付
  const { error: updateError } = await admin
    .from("orders")
    .update({
      status: "paid",
      trade_no: params.trade_no || order.trade_no,
      pay_type: params.type || order.pay_type,
      paid_at: new Date().toISOString(),
    })
    .eq("out_trade_no", outTradeNo)
    .neq("status", "paid")

  if (updateError) {
    console.log("[v0] notify update error:", updateError.message)
    return new NextResponse("fail", { status: 200 })
  }

  // 6. 完整项目包：激活用户套餐
  if (order.product_type === "project_pack") {
    await admin
      .from("profiles")
      .update({ plan_status: "beta_active" })
      .eq("id", order.user_id)
  }

  return new NextResponse("success", { status: 200 })
}

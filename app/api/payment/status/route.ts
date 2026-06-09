import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const dynamic = "force-dynamic"

/**
 * 订单状态查询（供前端轮询）。
 * 受 RLS 限制，仅能查询当前登录用户本人的订单。
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

  return NextResponse.json({
    status: order.status,
    paid: order.status === "paid",
    productType: order.product_type,
  })
}

import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { mapaySign, generateOutTradeNo, normalizeMapayMApiUrl, isMapaySuccess, getMapayQrCode } from "@/lib/mapay"
import { getProduct } from "@/lib/products"

export const dynamic = "force-dynamic"

export async function POST(request: Request) {
  try {
    // 1. 校验登录态
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "请先登录" }, { status: 401 })
    }

    // 2. 校验商品类型，金额以服务端价目表为准
    const body = await request.json().catch(() => ({}))
    const product = getProduct(body.productType)
    if (!product) {
      return NextResponse.json({ error: "商品类型无效" }, { status: 400 })
    }

    const pid = process.env.MAPAY_PID
    const key = process.env.MAPAY_KEY
    const apiUrl = process.env.MAPAY_API_URL
    if (!pid || !key || !apiUrl) {
      return NextResponse.json({ error: "支付未配置" }, { status: 500 })
    }

    // 3. 生成商户订单号，预创建订单记录（pending）
    const outTradeNo = generateOutTradeNo()
    const admin = createAdminClient()
    const { error: insertError } = await admin.from("orders").insert({
      user_id: user.id,
      amount: product.price,
      status: "pending",
      out_trade_no: outTradeNo,
      product_type: product.type,
      product_name: product.name,
      pay_type: "wxpay",
    })
    if (insertError) {
      console.log("[v0] order insert error:", insertError.message)
      return NextResponse.json({ error: "创建订单失败" }, { status: 500 })
    }

    // 4. 组装码支付 mapi 参数并签名
    const origin = new URL(request.url).origin
    const params: Record<string, string> = {
      pid,
      type: "wxpay",
      out_trade_no: outTradeNo,
      notify_url: `${origin}/api/payment/notify`,
      return_url: `${origin}/dashboard`,
      name: product.name,
      money: product.price,
      clientip:
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        "127.0.0.1",
      device: "pc",
    }
    params.sign = mapaySign(params, key)
    params.sign_type = "MD5"

    // 5. 请求码支付 mapi.php 获取二维码
    const form = new URLSearchParams(params)
    const payRes = await fetch(normalizeMapayMApiUrl(apiUrl), {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    })
    const rawText = await payRes.text()
    let payData: Record<string, any> | null = null
    try {
      payData = JSON.parse(rawText)
    } catch {
      payData = null
    }

    if (!isMapaySuccess(payData)) {
      console.log("[v0] mapay create failed, raw:", rawText.slice(0, 500))
      await admin
        .from("orders")
        .update({ status: "failed" })
        .eq("out_trade_no", outTradeNo)
      return NextResponse.json(
        { error: payData?.msg || "发起支付失败，请稍后再试" },
        { status: 502 },
      )
    }

    // 6. 提取二维码链接（兼容多种字段名）
    const qrCode = getMapayQrCode(payData)
    if (!qrCode) {
      console.log("[v0] mapay no qrcode, raw:", rawText.slice(0, 500))
      await admin
        .from("orders")
        .update({ status: "failed" })
        .eq("out_trade_no", outTradeNo)
      return NextResponse.json(
        { error: "支付平台未返回二维码链接" },
        { status: 502 },
      )
    }

    await admin
      .from("orders")
      .update({ qr_code: qrCode, trade_no: payData.trade_no || null })
      .eq("out_trade_no", outTradeNo)

    return NextResponse.json({
      outTradeNo,
      qrCode,
      money: product.price,
      productName: product.name,
    })
  } catch (e) {
    console.log("[v0] payment create exception:", (e as Error).message)
    return NextResponse.json({ error: "服务器异常" }, { status: 500 })
  }
}

import crypto from "crypto"

/**
 * 码支付 / 彩虹易支付 签名工具
 * 规则：
 * 1. 过滤掉 sign、sign_type 以及空值参数
 * 2. 按参数名 ASCII 字典序升序排序
 * 3. 拼接成 a=1&b=2&c=3 形式（不进行 URL 编码）
 * 4. 末尾直接拼接商户密钥（KEY），做 MD5，转小写
 */
export function mapaySign(
  params: Record<string, string | number | undefined | null>,
  key: string,
): string {
  const filtered = Object.entries(params)
    .filter(
      ([k, v]) =>
        k !== "sign" &&
        k !== "sign_type" &&
        v !== undefined &&
        v !== null &&
        String(v) !== "",
    )
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))

  const signStr = filtered.map(([k, v]) => `${k}=${v}`).join("&")
  return crypto.createHash("md5").update(signStr + key, "utf8").digest("hex")
}

/**
 * 校验码支付回调签名
 */
export function verifyMapaySign(
  params: Record<string, string>,
  key: string,
): boolean {
  const receivedSign = params.sign
  if (!receivedSign) return false
  const expected = mapaySign(params, key)
  return expected === receivedSign.toLowerCase()
}

/** 生成商户订单号：时间戳 + 随机串 */
export function generateOutTradeNo(): string {
  const ts = Date.now().toString()
  const rand = Math.random().toString(36).slice(2, 8)
  return `SP${ts}${rand}`
}

/**
 * 归一化码支付下单接口地址。
 * MAPAY_API_URL 既可填支付站点根地址，也可填完整的 mapi.php 地址。
 */
export function normalizeMapayMApiUrl(apiUrl: string): string {
  const trimmed = apiUrl.trim().replace(/\/+$/, "")
  if (/\/mapi\.php$/i.test(trimmed)) return trimmed
  if (/\.php$/i.test(trimmed)) return trimmed
  return `${trimmed}/mapi.php`
}

/**
 * 归一化码支付查询接口地址（api.php）。
 * 支持根地址或 mapi/submit/api.php 形式自动转换为 api.php。
 */
export function normalizeMapayQueryUrl(apiUrl: string): string {
  const trimmed = apiUrl.trim().replace(/\/+$/, "")
  if (/\/(mapi|submit|api)\.php$/i.test(trimmed)) {
    return trimmed.replace(/\/(mapi|submit|api)\.php$/i, "/api.php")
  }
  return `${trimmed}/api.php`
}

/** 判断码支付返回是否成功（code == 1，兼容字符串与数字） */
export function isMapaySuccess(payData: unknown): payData is Record<string, any> {
  return (
    !!payData &&
    typeof payData === "object" &&
    String((payData as Record<string, any>).code) === "1"
  )
}

/** 从码支付返回中提取二维码链接，兼容多种字段名 */
export function getMapayQrCode(payData: Record<string, any>): string {
  const value =
    payData.qrcode ||
    payData.code_url ||
    payData.payurl ||
    payData.urlscheme ||
    payData.qrCode ||
    payData.url ||
    ""
  return String(value)
}

/** 判断查询/通知返回是否为已支付状态 */
export function isPaidStatus(data: Record<string, any>): boolean {
  return (
    String(data.trade_status || "").toUpperCase() === "TRADE_SUCCESS" ||
    String(data.status) === "1"
  )
}

/** 金额比较：转数字后允许极小误差，避免 299 与 299.00 被误判 */
export function sameMoney(
  a: string | number | undefined,
  b: string | number | undefined,
): boolean {
  if (a === undefined || b === undefined) return false
  const left = Number(a)
  const right = Number(b)
  return Number.isFinite(left) && Number.isFinite(right) && Math.abs(left - right) < 0.001
}

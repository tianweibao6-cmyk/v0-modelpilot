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

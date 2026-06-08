"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Mail, ArrowLeft } from "lucide-react"

const RESEND_COOLDOWN = 60

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const errorParam = searchParams.get("error")

  const initialError =
    errorParam === "expired" || errorParam
      ? "登录状态已失效，请重新登录。"
      : null

  // 流程阶段：email = 输入邮箱；otp = 输入验证码
  const [step, setStep] = useState<"email" | "otp">("email")
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)
  const [message, setMessage] = useState<string | null>(null)
  const [cooldown, setCooldown] = useState(0)

  const redirectTarget = searchParams.get("redirect") ?? "/dashboard"

  // 重新发送验证码倒计时
  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  // 发送验证码
  const sendCode = async () => {
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    })

    setLoading(false)

    if (error) {
      setError(translateError(error.message))
      return false
    }
    return true
  }

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    const ok = await sendCode()
    if (ok) {
      setStep("otp")
      setOtp("")
      setMessage("验证码已发送至你的邮箱，请输入邮件中的 6 位验证码完成登录/注册。")
      setCooldown(RESEND_COOLDOWN)
    }
  }

  const handleResend = async () => {
    if (cooldown > 0 || loading) return
    const ok = await sendCode()
    if (ok) {
      setMessage("验证码已重新发送，请查收邮箱。")
      setCooldown(RESEND_COOLDOWN)
    }
  }

  // 校验验证码
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: "email",
    })

    if (error) {
      setError(translateError(error.message))
      setOtp("")
      setLoading(false)
      return
    }

    // 验证成功：自动登录并跳转
    router.push(redirectTarget)
    router.refresh()
  }

  const handleBackToEmail = () => {
    setStep("email")
    setOtp("")
    setError(null)
    setMessage(null)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-12 bg-background">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <span className="text-2xl font-bold text-foreground">SigmaPilot</span>
        </Link>

        <div className="rounded-2xl border border-border bg-card shadow-soft-lg p-6 md:p-8">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2 text-balance">
              {step === "email" ? "欢迎使用 SigmaPilot" : "输入验证码"}
            </h1>
            <p className="text-muted-foreground text-sm text-pretty">
              {step === "email"
                ? "输入邮箱获取验证码，登录或注册 AI 建模副驾驶"
                : `验证码已发送至 ${email}`}
            </p>
          </div>

          {/* 提示信息 */}
          {error && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}
          {message && (
            <div className="flex items-start gap-2 p-3 mb-4 rounded-lg bg-primary/10 border border-primary/20">
              <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground">{message}</p>
            </div>
          )}

          {/* 第一步：邮箱输入 */}
          {step === "email" && (
            <form onSubmit={handleSendCode} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="login-email">邮箱</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full btn-gradient border-0 py-6 text-base font-semibold gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    发送验证码
                  </>
                )}
              </Button>
            </form>
          )}

          {/* 第二步：验证码输入 */}
          {step === "otp" && (
            <form onSubmit={handleVerify} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="otp-code">6 位验证码</Label>
                <Input
                  id="otp-code"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="请输入邮件中的 6 位验证码"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  className="text-center text-lg tracking-[0.5em] font-semibold"
                />
              </div>
              <Button
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full btn-gradient border-0 py-6 text-base font-semibold"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "验证并登录"}
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  更换邮箱
                </button>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={cooldown > 0 || loading}
                  className="text-primary hover:underline disabled:text-muted-foreground disabled:no-underline disabled:cursor-not-allowed"
                >
                  {cooldown > 0 ? `重新发送（${cooldown}s）` : "重新发送验证码"}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* 免责声明 */}
        <p className="text-center text-xs text-muted-foreground mt-6 leading-relaxed px-4">
          SigmaPilot 仅用于学习辅助、思路启发和代码参考，不提供代写服务，不承诺竞赛结果。
        </p>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            返回首页
          </Link>
        </p>
      </div>
    </main>
  )
}

function translateError(message: string): string {
  if (!message) return "操作失败，请稍后重试"

  const lower = message.toLowerCase()

  if (lower.includes("expired") || lower.includes("invalid") || lower.includes("incorrect")) {
    return "验证码错误或已过期"
  }
  if (lower.includes("rate limit") || lower.includes("too many") || lower.includes("for security purposes")) {
    return "邮件发送太频繁，请稍后再试"
  }
  if (lower.includes("invalid format") || lower.includes("validate email") || lower.includes("invalid email")) {
    return "邮箱格式不正确，请检查后重试"
  }
  if (lower.includes("network") || lower.includes("fetch")) {
    return "网络连接异常，请检查网络后重试"
  }

  // 兜底：避免直接暴露英文报错
  return "操作失败，请稍后重试"
}

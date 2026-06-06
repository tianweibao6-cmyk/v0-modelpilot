"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"

export function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  const [tab, setTab] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(
    searchParams.get("error") ? "登录状态已失效，请重新登录" : null,
  )
  const [message, setMessage] = useState<string | null>(null)

  const redirectTarget = searchParams.get("redirect") ?? "/dashboard"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(translateError(error.message))
      setLoading(false)
      return
    }

    router.push(redirectTarget)
    router.refresh()
  }

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setMessage(null)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${window.location.origin}/auth/callback`,
      },
    })

    if (error) {
      setError(translateError(error.message))
      setLoading(false)
      return
    }

    // 如果开启了邮箱确认，session 为空，需要提示去邮箱确认
    if (data.session) {
      router.push(redirectTarget)
      router.refresh()
    } else {
      setMessage("注册成功！我们已向你的邮箱发送确认邮件，请确认后登录。")
      setTab("login")
      setLoading(false)
    }
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
              欢迎使用 SigmaPilot
            </h1>
            <p className="text-muted-foreground text-sm text-pretty">
              登录或注册以使用 AI 建模副驾驶
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

          <Tabs value={tab} onValueChange={(v) => setTab(v as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">登录</TabsTrigger>
              <TabsTrigger value="signup">注册</TabsTrigger>
            </TabsList>

            {/* 登录 */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="login-password">密码</Label>
                    <button
                      type="button"
                      onClick={() => setMessage("找回密码功能即将上线，请稍后再试。")}
                      className="text-xs text-primary hover:underline"
                    >
                      忘记密码？
                    </button>
                  </div>
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="请输入密码"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-gradient border-0 py-6 text-base font-semibold">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "登录"}
                </Button>
              </form>
            </TabsContent>

            {/* 注册 */}
            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-email">邮箱</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="signup-password">密码</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="至少 6 位密码"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading} className="w-full btn-gradient border-0 py-6 text-base font-semibold">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "注册"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
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
  const map: Record<string, string> = {
    "Invalid login credentials": "邮箱或密码错误，请重试",
    "User already registered": "该邮箱已注册，请直接登录",
    "Email not confirmed": "邮箱尚未确认，请先到邮箱完成确认",
    "Password should be at least 6 characters": "密码至少需要 6 位",
  }
  return map[message] ?? message
}

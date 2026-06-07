import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle2 } from "lucide-react"

export default function VerifiedPage() {
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

        <div className="rounded-2xl border border-border bg-card shadow-soft-lg p-6 md:p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-7 h-7 text-primary" />
          </div>

          <h1 className="text-2xl font-bold text-foreground mb-3 text-balance">邮箱验证成功</h1>
          <p className="text-muted-foreground text-sm leading-relaxed text-pretty mb-8">
            你的邮箱已经完成验证，现在可以登录 SigmaPilot。
          </p>

          <Button asChild className="w-full btn-gradient border-0 py-6 text-base font-semibold">
            <Link href="/login?verified=true">去登录</Link>
          </Button>
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

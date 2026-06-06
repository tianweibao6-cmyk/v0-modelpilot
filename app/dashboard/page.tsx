import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { LogoutButton } from "@/components/logout-button";
import { Sparkles, FileText, Receipt, Crown, Clock, CheckCircle2, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard");
  }

  // 并行读取用户档案、订单、报告
  const [{ data: profile }, { data: orders }, { data: reports }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("reports").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
  ]);

  const isActive = profile?.plan_status === "beta_active";

  return (
    <main className="min-h-screen bg-background">
      {/* 顶部栏 */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold text-foreground">SigmaPilot</span>
          </Link>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* 欢迎区 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1 text-balance">
            你好，{user.email?.split("@")[0]}
          </h1>
          <p className="text-muted-foreground">欢迎回到你的 SigmaPilot 工作台</p>
        </div>

        {/* 套餐状态卡片 */}
        <div className="rounded-2xl border border-border bg-card shadow-soft p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isActive ? "btn-gradient" : "bg-secondary"
                }`}
              >
                <Crown className={`w-6 h-6 ${isActive ? "text-white" : "text-muted-foreground"}`} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">当前套餐状态</p>
                <p className="text-xl font-bold text-foreground">
                  {isActive ? "内测体验已激活" : "尚未解锁"}
                </p>
              </div>
            </div>
            {!isActive && (
              <Link
                href="/#pricing"
                className="btn-gradient border-0 inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold text-white"
              >
                立即解锁（¥39）
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 我的报告 */}
          <section className="rounded-2xl border border-border bg-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-5">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">我的分析报告</h2>
            </div>
            {reports && reports.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {reports.map((report) => (
                  <li
                    key={report.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-foreground truncate">{report.title}</span>
                    </div>
                    <span
                      className={`flex items-center gap-1 text-xs font-medium flex-shrink-0 ${
                        report.status === "ready" ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      {report.status === "ready" ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          已就绪
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5" />
                          处理中
                        </>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-1">还没有分析报告</p>
                <p className="text-xs text-muted-foreground/70">上传赛题后，报告将显示在这里</p>
              </div>
            )}
          </section>

          {/* 我的订单 */}
          <section className="rounded-2xl border border-border bg-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-5">
              <Receipt className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-bold text-foreground">我的订单</h2>
            </div>
            {orders && orders.length > 0 ? (
              <ul className="flex flex-col gap-3">
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground">¥{order.amount} · 单次解锁</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(order.created_at).toLocaleString("zh-CN")}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-medium flex-shrink-0 px-2 py-1 rounded-full ${
                        order.status === "verified"
                          ? "bg-primary/10 text-primary"
                          : order.status === "paid"
                            ? "bg-accent/10 text-accent"
                            : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {order.status === "verified" ? "已核验" : order.status === "paid" ? "待核验" : "待支付"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground mb-1">还没有订单记录</p>
                <p className="text-xs text-muted-foreground/70">完成解锁后，订单将显示在这里</p>
              </div>
            )}
          </section>
        </div>

        {/* 免责声明 */}
        <p className="text-center text-xs text-muted-foreground mt-10 leading-relaxed">
          SigmaPilot 仅用于学习辅助、思路启发和代码参考，不提供代写服务，不承诺竞赛结果。
        </p>
      </div>
    </main>
  );
}

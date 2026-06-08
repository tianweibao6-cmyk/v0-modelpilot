"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { FolderOpen, Download, Receipt, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PlaceholderViewProps {
  type: "projects" | "downloads" | "orders";
  user: User | null;
}

const config = {
  projects: {
    icon: FolderOpen,
    title: "我的项目",
    desc: "你提交的建模项目包会显示在这里，可查看生成进度与状态",
    empty: "还没有项目，前往「完整项目包」开始生成",
  },
  downloads: {
    icon: Download,
    title: "下载中心",
    desc: "项目包生成完成后，论文初稿、代码、图表等文件可在此下载",
    empty: "暂无可下载文件",
  },
  orders: {
    icon: Receipt,
    title: "订单记录",
    desc: "查看你的项目包与图示生成订单及核验状态",
    empty: "还没有订单记录",
  },
} as const;

export function PlaceholderView({ type, user }: PlaceholderViewProps) {
  const c = config[type];
  const Icon = c.icon;

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">{c.title}</h1>
        <p className="text-muted-foreground text-pretty">{c.desc}</p>
      </div>

      <div className="rounded-2xl border border-border bg-card shadow-soft p-12">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-muted-foreground" />
          </div>
          {user ? (
            <>
              <p className="text-foreground font-medium mb-1">{c.empty}</p>
              <p className="text-sm text-muted-foreground">登录账号：{user.email}</p>
            </>
          ) : (
            <>
              <p className="text-foreground font-medium mb-4">登录后即可查看{c.title}</p>
              <Button asChild className="btn-gradient border-0 gap-2">
                <Link href="/login">
                  <LogIn className="w-4 h-4" />
                  登录 / 注册
                </Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

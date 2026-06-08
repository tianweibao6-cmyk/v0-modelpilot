"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { FolderOpen, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectsViewProps {
  user: User | null;
}

export function ProjectsView({ user }: ProjectsViewProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
          我的项目
        </h1>
        <p className="text-muted-foreground text-pretty">
          查看你的完整项目包与论文图示生成记录、支付状态、生成状态和下载文件
        </p>
      </div>

      {user ? (
        <div className="rounded-2xl border border-border bg-card shadow-soft overflow-hidden">
          {/* 表头 */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border bg-secondary/50 text-xs font-medium text-muted-foreground">
            <div className="col-span-5">项目 / 图示</div>
            <div className="col-span-2">类型</div>
            <div className="col-span-2">支付状态</div>
            <div className="col-span-2">生成状态</div>
            <div className="col-span-1 text-right">下载</div>
          </div>

          {/* 空状态 */}
          <div className="px-6 py-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-1">还没有任何记录</p>
            <p className="text-sm text-muted-foreground">
              前往「完整项目包」或「论文图示」开始生成，记录会显示在这里
            </p>
            <p className="text-xs text-muted-foreground/80 mt-4">登录账号：{user.email}</p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card shadow-soft p-12">
          <div className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-foreground font-medium mb-4">
              登录后查看你的项目、订单和下载文件
            </p>
            <Button asChild className="btn-gradient border-0 gap-2">
              <Link href="/login">
                <LogIn className="w-4 h-4" />
                登录 / 注册
              </Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

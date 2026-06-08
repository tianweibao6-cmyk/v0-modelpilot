"use client";

import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import {
  LayoutGrid,
  Package,
  Workflow,
  GitBranch,
  FolderOpen,
  Download,
  Receipt,
  Tag,
  Sparkles,
  LogIn,
} from "lucide-react";

export type WorkbenchView =
  | "overview"
  | "project-pack"
  | "mechanism"
  | "flowchart"
  | "projects"
  | "downloads"
  | "orders"
  | "pricing";

interface NavItem {
  id: WorkbenchView;
  label: string;
  icon: React.ElementType;
}

const navItems: NavItem[] = [
  { id: "overview", label: "工作台", icon: LayoutGrid },
  { id: "project-pack", label: "完整项目包", icon: Package },
  { id: "mechanism", label: "机制图生成", icon: Workflow },
  { id: "flowchart", label: "流程图生成", icon: GitBranch },
  { id: "projects", label: "我的项目", icon: FolderOpen },
  { id: "downloads", label: "下载中心", icon: Download },
  { id: "orders", label: "订单记录", icon: Receipt },
  { id: "pricing", label: "定价说明", icon: Tag },
];

interface WorkbenchSidebarProps {
  active: WorkbenchView;
  onSelect: (view: WorkbenchView) => void;
  user: User | null;
}

export function WorkbenchSidebar({ active, onSelect, user }: WorkbenchSidebarProps) {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 shrink-0 border-r border-border bg-card/50 h-screen sticky top-0">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 px-6 h-16 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
          <Sparkles className="w-4 h-4 text-primary" />
        </div>
        <span className="text-lg font-bold text-foreground">SigmaPilot</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              }`}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Account */}
      <div className="px-3 py-4 border-t border-border">
        {user ? (
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-primary">
                {user.email?.[0]?.toUpperCase() ?? "U"}
              </span>
            </div>
            <span className="truncate">{user.email?.split("@")[0]}</span>
          </Link>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogIn className="w-4 h-4 shrink-0" />
            登录 / 注册
          </Link>
        )}
      </div>
    </aside>
  );
}

/* 移动端顶部下拉导航 */
export function WorkbenchMobileNav({ active, onSelect }: Omit<WorkbenchSidebarProps, "user">) {
  return (
    <div className="lg:hidden border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-2 px-4 h-14">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-primary/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
          <span className="font-bold text-foreground">SigmaPilot</span>
        </Link>
      </div>
      <nav className="flex gap-1 px-3 pb-2 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelect(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary"
              }`}
            >
              <item.icon className="w-3.5 h-3.5 shrink-0" />
              {item.label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

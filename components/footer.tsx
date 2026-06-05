import { Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-4 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">SigmaPilot</span>
          </div>

          {/* Copyright */}
          <p className="text-muted-foreground text-sm text-center">
            © 2024 SigmaPilot. AI 建模学习辅助工具
          </p>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              隐私政策
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              服务条款
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              联系我们
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, BookOpen, Lightbulb } from "lucide-react";

export function HeroSection({ onPurchase }: { onPurchase: () => void }) {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/15 mb-8">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-medium">AI 建模辅助工具内测中</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
          SigmaPilot
          <br />
          <span className="text-gradient">AI 建模副驾驶</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty">
          上传赛题与数据，获取审题拆解、建模路线、代码框架、图表建议和论文结构参考
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            onClick={onPurchase}
            size="lg" 
            className="btn-gradient px-8 py-6 text-lg gap-2 border-0"
          >
            立即上传赛题
            <ArrowRight className="w-5 h-5" />
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg bg-transparent border-border text-foreground hover:bg-secondary"
          >
            <a href="#features">了解更多</a>
          </Button>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <BookOpen className="w-5 h-5" />
              <span className="text-lg font-semibold">审题拆解</span>
            </div>
            <span className="text-muted-foreground text-sm">快速理解题目要点</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Lightbulb className="w-5 h-5" />
              <span className="text-lg font-semibold">思路启发</span>
            </div>
            <span className="text-muted-foreground text-sm">多角度建模参考</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              <span className="text-lg font-semibold">代码参考</span>
            </div>
            <span className="text-muted-foreground text-sm">框架示例供学习</span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Trophy, Clock } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-primary text-sm font-medium">数模竞赛的 AI 革命已到来</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight text-balance">
          让 AI 成为你的
          <br />
          <span className="text-primary">数模竞赛最强外挂</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          从赛题分析到论文输出，ModelPilot 全程陪伴，帮你实现从小白到国奖的华丽蜕变
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Button 
            asChild
            size="lg" 
            className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg gap-2"
          >
            <a href="#upload">
              立即上传赛题
              <ArrowRight className="w-5 h-5" />
            </a>
          </Button>
          <Button 
            asChild
            variant="outline" 
            size="lg" 
            className="px-8 py-6 text-lg border-border hover:bg-secondary"
          >
            <a href="#features">了解更多</a>
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Trophy className="w-5 h-5" />
              <span className="text-3xl font-bold">98%</span>
            </div>
            <span className="text-muted-foreground text-sm">用户获奖率</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Clock className="w-5 h-5" />
              <span className="text-3xl font-bold">10x</span>
            </div>
            <span className="text-muted-foreground text-sm">效率提升</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-5 h-5" />
              <span className="text-3xl font-bold">5000+</span>
            </div>
            <span className="text-muted-foreground text-sm">服务用户</span>
          </div>
        </div>
      </div>
    </section>
  );
}

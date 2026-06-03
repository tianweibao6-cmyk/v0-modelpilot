"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

interface PricingCardProps {
  onPurchase: () => void;
}

const features = [
  "完整的建模思路分析报告",
  "多种算法模型对比推荐",
  "Python/MATLAB 代码框架",
  "符合规范的论文框架",
  "数据可视化模板",
  "7×24 小时 AI 响应",
];

export function PricingCard({ onPurchase }: PricingCardProps) {
  return (
    <div className="relative">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-3xl" />
      
      <div className="relative rounded-3xl border-2 border-primary/50 bg-card p-8 md:p-10">
        {/* Popular Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            限时特惠
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h3 className="text-2xl font-bold text-foreground mb-2">单次解锁</h3>
          <p className="text-muted-foreground mb-6">一次付费，终身受益</p>
          
          {/* Price */}
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-muted-foreground line-through text-xl">¥99</span>
            <span className="text-5xl md:text-6xl font-bold text-primary">¥39</span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">单次赛题分析</p>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button 
          onClick={onPurchase}
          className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90 gap-2"
        >
          <Zap className="w-5 h-5" />
          立即购买
        </Button>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-primary" />
            安全支付
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-primary" />
            即时交付
          </span>
        </div>
      </div>
    </div>
  );
}

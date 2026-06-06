"use client";

import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap } from "lucide-react";

interface PricingCardProps {
  onPurchase: () => void;
}

const features = [
  "完整的审题拆解报告",
  "多种建模方向参考",
  "Python/MATLAB 代码框架示例",
  "论文结构框架参考",
  "数据可视化图表建议",
  "格式规范性检查提示",
];

export function PricingCard({ onPurchase }: PricingCardProps) {
  return (
    <div className="relative">
      <div className="relative rounded-3xl border border-border bg-card shadow-soft-lg p-8 md:p-10">
        {/* Popular Badge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full btn-gradient text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            内测优惠
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8 pt-4">
          <h3 className="text-2xl font-bold text-foreground mb-2">单次使用</h3>
          <p className="text-muted-foreground mb-6">一次付费，获取完整分析报告</p>
          
          {/* Price */}
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-muted-foreground/60 line-through text-xl">¥99</span>
            <span className="text-5xl md:text-6xl font-extrabold text-primary">¥39</span>
          </div>
          <p className="text-muted-foreground mt-2 text-sm">单次赛题分析</p>
        </div>

        {/* Features List */}
        <ul className="space-y-4 mb-8">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-foreground">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button 
          onClick={onPurchase}
          className="w-full py-6 text-lg font-semibold btn-gradient border-0 gap-2"
        >
          <Zap className="w-5 h-5" />
          立即购买
        </Button>

        {/* Trust Badges */}
        <div className="mt-6 flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-primary" />
            内测体验
          </span>
          <span className="flex items-center gap-1">
            <Check className="w-4 h-4 text-primary" />
            人工核验开通
          </span>
        </div>
      </div>
    </div>
  );
}

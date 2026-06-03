"use client";

import { Brain, Code, FileText, LineChart } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "智能题目解析",
    description: "深度理解赛题背景与核心问题，自动提取关键变量与约束条件，为你梳理清晰的建模思路",
    highlight: "GPT-4 级别理解力",
  },
  {
    icon: LineChart,
    title: "多模型匹配推荐",
    description: "基于题目特征智能匹配最优算法，覆盖优化、预测、评价、仿真等主流建模方向",
    highlight: "100+ 算法模型库",
  },
  {
    icon: Code,
    title: "代码自动生成",
    description: "一键生成 Python/MATLAB 代码框架，包含数据处理、模型构建、结果可视化全套流程",
    highlight: "即插即用",
  },
  {
    icon: FileText,
    title: "论文框架输出",
    description: "自动生成符合国赛/美赛规范的论文框架，包含摘要、问题分析、模型建立等核心章节",
    highlight: "符合评审标准",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group relative p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5"
        >
          {/* Background Gradient on Hover */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="relative">
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
              <feature.icon className="w-7 h-7 text-primary" />
            </div>

            {/* Highlight Tag */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
              {feature.highlight}
            </span>

            {/* Content */}
            <h3 className="text-xl font-semibold text-foreground mb-3">
              {feature.title}
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

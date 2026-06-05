"use client";

import { Brain, Code, FileText, LineChart, BarChart3, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "审题拆解",
    description: "深度分析赛题背景与核心问题，自动提取关键变量与约束条件，帮助你快速理清建模思路",
    highlight: "问题理解辅助",
  },
  {
    icon: LineChart,
    title: "模型推荐",
    description: "基于题目特征提供多种建模方向参考，覆盖优化、预测、评价、仿真等常见建模类型",
    highlight: "多方向思路参考",
  },
  {
    icon: Code,
    title: "代码框架",
    description: "生成 Python/MATLAB 代码框架示例，包含数据处理、模型构建、结果可视化等模块参考",
    highlight: "学习代码结构",
  },
  {
    icon: BarChart3,
    title: "图表建议",
    description: "根据数据特征和建模需求，推荐合适的可视化图表类型，提供绘图代码参考",
    highlight: "数据可视化参考",
  },
  {
    icon: FileText,
    title: "论文结构参考",
    description: "提供符合学术规范的论文框架建议，包含摘要、问题分析、模型建立等章节结构参考",
    highlight: "写作框架参考",
  },
  {
    icon: CheckCircle,
    title: "格式质检",
    description: "检查论文格式规范性，包括图表编号、公式格式、参考文献等常见问题提示",
    highlight: "规范性检查",
  },
];

export function FeatureCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

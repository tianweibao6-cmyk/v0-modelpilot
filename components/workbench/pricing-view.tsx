"use client";

import { Package, Workflow, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PricingViewProps {
  onProjectPack: () => void;
  onMechanism: () => void;
}

export function PricingView({ onProjectPack, onMechanism }: PricingViewProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">定价说明</h1>
        <p className="text-muted-foreground text-pretty">
          按次付费，无需订阅。根据需求选择完整项目包或单次图示生成
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* 完整项目包 */}
        <div className="flex flex-col rounded-2xl border-2 border-primary bg-card shadow-soft p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg btn-gradient flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-bold text-foreground">完整项目包生成</h2>
          </div>
          <div className="mb-4">
            <span className="text-4xl font-extrabold text-primary">¥299</span>
            <span className="text-muted-foreground"> / 次</span>
          </div>
          <ul className="flex flex-col gap-2.5 mb-7 flex-1">
            {[
              "论文初稿（Word / LaTeX）",
              "Python 代码与图表文件",
              "中间结果表格与附录",
              "参考文献与 AI 使用说明",
              "质量检查报告",
              "预计生成时间 30–60 分钟",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button onClick={onProjectPack} className="w-full py-5 btn-gradient border-0 mt-auto">
            立即生成项目包
          </Button>
        </div>

        {/* 机制图 / 流程图 */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-soft p-7">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <Workflow className="w-5 h-5 text-accent" />
            </div>
            <h2 className="font-bold text-foreground">机制图 / 流程图生成</h2>
          </div>
          <div className="mb-4">
            <span className="text-2xl font-bold text-foreground">免费体验 1 次</span>
            <p className="text-muted-foreground text-sm mt-1">之后 ¥9.9 起 / 次</p>
          </div>
          <ul className="flex flex-col gap-2.5 mb-7 flex-1">
            {[
              "机制图、流程图",
              "技术路线图、研究框架图",
              "变量关系图",
              "多种学术风格可选",
              "可下载 PNG / SVG",
              "适用于论文与课堂展示",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-accent" />
                </span>
                {item}
              </li>
            ))}
          </ul>
          <Button
            onClick={onMechanism}
            variant="outline"
            className="w-full py-5 bg-transparent border-border text-foreground hover:bg-secondary mt-auto"
          >
            免费体验
          </Button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-8 leading-relaxed">
        SigmaPilot 仅用于学习辅助、思路启发、代码参考和报告草稿生成，不提供代写服务，不承诺竞赛结果。用户需自行遵守所在学校、赛事和平台规则。
      </p>
    </div>
  );
}

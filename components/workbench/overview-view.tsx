"use client";

import { Package, Workflow, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OverviewViewProps {
  onProjectPack: () => void;
  onDiagram: () => void;
}

const projectPackItems = [
  "Word / LaTeX 论文初稿",
  "Python 代码",
  "图表文件",
  "中间结果表格",
  "参考文献与附录",
  "AI 使用说明",
  "质量检查报告",
];

const diagramItems = [
  "研究框架图",
  "技术路线图",
  "机制路径图",
  "模型流程图",
  "变量关系图",
  "PNG / SVG 下载",
];

export function OverviewView({ onProjectPack, onDiagram }: OverviewViewProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
          工作台总览
        </h1>
        <p className="text-muted-foreground text-pretty">
          SigmaPilot 帮你生成完整建模项目包与论文图示，选择下方核心功能开始
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 卡片 1：完整项目包 */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-soft p-7 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl btn-gradient flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary">¥299</p>
              <p className="text-xs text-muted-foreground">/ 次</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">完整项目包生成</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            上传赛题与数据，自动生成可编辑的建模报告初稿、Python 代码、图表文件和支撑材料。
          </p>

          <ul className="flex flex-col gap-2.5 mb-7">
            {projectPackItems.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-primary" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Button onClick={onProjectPack} className="w-full py-5 btn-gradient border-0 gap-2 mt-auto">
            立即生成项目包
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* 卡片 2：论文图示 */}
        <div className="flex flex-col rounded-2xl border border-border bg-card shadow-soft p-7 hover:shadow-soft-lg transition-shadow">
          <div className="flex items-start justify-between mb-5">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
              <Workflow className="w-6 h-6 text-accent" />
            </div>
            <div className="text-right">
              <p className="text-2xl font-extrabold text-primary">¥9.9</p>
              <p className="text-xs text-muted-foreground">/ 次</p>
            </div>
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">论文图示生成</h2>
          <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
            输入论文摘要、研究主题或方法描述，生成研究框架图、技术路线图、机制路径图、模型流程图和变量关系图。
          </p>

          <ul className="flex flex-col gap-2.5 mb-7">
            {diagramItems.map((item) => (
              <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                <span className="w-4 h-4 rounded-full bg-accent/15 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-accent" />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <Button onClick={onDiagram} className="w-full py-5 btn-gradient border-0 gap-2 mt-auto">
            立即生成图示
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

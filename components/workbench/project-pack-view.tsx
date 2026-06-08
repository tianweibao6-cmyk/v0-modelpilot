"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Database, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProjectPackViewProps {
  onSubmit: () => void;
}

const packContents = [
  "Word / LaTeX 论文初稿",
  "Python 代码",
  "图表文件",
  "中间结果表格",
  "摘要、参考文献与附录",
  "AI 使用说明",
  "质量检查报告",
];

function DropArea({
  icon: Icon,
  title,
  hint,
  onTrigger,
}: {
  icon: React.ElementType;
  title: string;
  hint: string;
  onTrigger: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      onTrigger();
    },
    [onTrigger],
  );

  return (
    <button
      type="button"
      onClick={onTrigger}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
      onDrop={handleDrop}
      className={`w-full border-2 border-dashed rounded-xl p-8 transition-all text-center ${
        isDragging
          ? "border-primary bg-primary/5"
          : "border-[#d4d4d8] bg-[#f4f4f5] hover:border-primary/50 hover:bg-secondary/70"
      }`}
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <p className="font-medium text-foreground mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{hint}</p>
    </button>
  );
}

export function ProjectPackView({ onSubmit }: ProjectPackViewProps) {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">
          完整项目包生成
        </h1>
        <p className="text-muted-foreground text-pretty">
          生成可编辑的建模报告初稿与配套材料，适用于课程报告、建模训练、数据分析项目和学习辅助
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* 左侧：上传与说明 */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <DropArea
              icon={Upload}
              title="上传赛题"
              hint="支持 PDF、Word、TXT，最大 50MB"
              onTrigger={onSubmit}
            />
            <DropArea
              icon={Database}
              title="上传数据"
              hint="支持 CSV、Excel、ZIP 等数据文件"
              onTrigger={onSubmit}
            />
          </div>

          <div className="rounded-2xl border border-border bg-card shadow-soft p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-foreground">项目包内容说明</h2>
            </div>
            <ul className="grid sm:grid-cols-2 gap-2.5">
              {packContents.map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-foreground">
                  <span className="w-4 h-4 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-primary" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 右侧：价格与提交 */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card shadow-soft p-6 sticky top-6">
            <p className="text-sm text-muted-foreground mb-1">单次生成价格</p>
            <p className="text-4xl font-extrabold text-primary mb-4">¥299</p>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 rounded-lg bg-secondary/50">
              <Clock className="w-4 h-4 text-primary shrink-0" />
              预计生成时间：30–60 分钟
            </div>

            <Button onClick={onSubmit} className="w-full py-5 btn-gradient border-0">
              提交并生成项目包
            </Button>

            <p className="text-xs text-muted-foreground mt-4 leading-relaxed">
              生成可编辑的建模报告初稿与配套材料，仅供学习参考。SigmaPilot 不提供代写服务，不承诺竞赛结果。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { ImageIcon, Download, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface DiagramOption {
  id: string;
  label: string;
}

interface DiagramGeneratorProps {
  title: string;
  description: string;
  inputPlaceholder: string;
  optionLabel: string;
  options: DiagramOption[];
  generateLabel: string;
  /** 免费体验额度用尽后触发付费弹窗 */
  onLocked?: () => void;
}

export function DiagramGenerator({
  title,
  description,
  inputPlaceholder,
  optionLabel,
  options,
  generateLabel,
  onLocked,
}: DiagramGeneratorProps) {
  const [text, setText] = useState("");
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  const [status, setStatus] = useState<"idle" | "generating" | "done">("idle");
  const [usedFree, setUsedFree] = useState(false);

  const handleGenerate = () => {
    if (!text.trim()) return;
    // 免费体验仅 1 次，之后触发付费
    if (usedFree && onLocked) {
      onLocked();
      return;
    }
    setStatus("generating");
    setTimeout(() => {
      setStatus("done");
      setUsedFree(true);
    }, 1800);
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2 text-balance">{title}</h1>
        <p className="text-muted-foreground text-pretty">{description}</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* 输入区 */}
        <div className="flex flex-col gap-5">
          <div className="rounded-2xl border border-border bg-card shadow-soft p-6">
            <label className="block text-sm font-medium text-foreground mb-2">输入内容</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={inputPlaceholder}
              rows={6}
              className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring"
            />

            <p className="text-sm font-medium text-foreground mt-5 mb-3">{optionLabel}</p>
            <div className="flex flex-wrap gap-2">
              {options.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setSelected(opt.id)}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors ${
                    selected === opt.id
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!text.trim() || status === "generating"}
              className="w-full py-5 btn-gradient border-0 gap-2 mt-6"
            >
              {status === "generating" ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  {generateLabel}
                </>
              )}
            </Button>
            {!usedFree && (
              <p className="text-xs text-muted-foreground mt-3 text-center">
                首次生成免费体验，之后 ¥9.9 起
              </p>
            )}
          </div>
        </div>

        {/* 结果预览区 */}
        <div className="rounded-2xl border border-border bg-card shadow-soft p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">结果预览</h2>
            {status === "done" && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="bg-transparent border-border text-foreground hover:bg-secondary gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  PNG
                </Button>
                <Button size="sm" variant="outline" className="bg-transparent border-border text-foreground hover:bg-secondary gap-1.5">
                  <Download className="w-3.5 h-3.5" />
                  SVG
                </Button>
              </div>
            )}
          </div>

          <div className="flex-1 min-h-[300px] rounded-xl border border-dashed border-[#d4d4d8] bg-[#f4f4f5] flex items-center justify-center p-6">
            {status === "idle" && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl bg-background flex items-center justify-center mx-auto mb-3 border border-border">
                  <ImageIcon className="w-7 h-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">输入内容并生成后，图示将在此预览</p>
              </div>
            )}
            {status === "generating" && (
              <div className="text-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">正在生成图示，请稍候...</p>
              </div>
            )}
            {status === "done" && (
              <div className="text-center">
                <div className="w-14 h-14 rounded-xl btn-gradient flex items-center justify-center mx-auto mb-3">
                  <ImageIcon className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm font-medium text-foreground mb-1">图示已生成</p>
                <p className="text-xs text-muted-foreground">可下载 PNG / SVG 用于论文与展示</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { X, ShieldCheck, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  priceLabel?: string;
  payButtonLabel?: string;
  items?: string[];
}

const PAYMENT_URL = "https://mzf.mapay.cc/cashier/e2d6d7e799";

export function PaymentModal({
  isOpen,
  onClose,
  title = "解锁 SigmaPilot 完整项目包",
  description = "支付后将为你生成一套完整的建模报告初稿与配套材料，包括论文初稿、Python 代码、图表文件与质量检查报告。",
  priceLabel = "299 元",
  payButtonLabel = "立即支付 299 元",
  items = [
    "Word / LaTeX 论文初稿",
    "Python 代码",
    "图表文件",
    "中间结果表格",
    "参考文献与附录",
    "AI 使用说明",
    "质量检查报告",
  ],
}: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  const handlePay = () => {
    window.open(PAYMENT_URL, "_blank", "noopener,noreferrer");
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="关闭弹窗"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3 text-balance">
            {title}
          </h2>

          <p className="text-muted-foreground text-center mb-8 text-pretty leading-relaxed">
            {description.split(priceLabel).length > 1 ? (
              <>
                {description.split(priceLabel)[0]}
                <span className="text-primary font-semibold">{priceLabel}</span>
                {description.split(priceLabel)[1]}
              </>
            ) : (
              description
            )}
          </p>

          {/* Included Items */}
          {items.length > 0 && (
            <div className="rounded-2xl bg-secondary/40 border border-border p-5 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <FileText className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground">本次服务包含</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Pay Button */}
          <Button
            onClick={handlePay}
            className="w-full py-6 text-lg font-semibold btn-gradient border-0"
          >
            {payButtonLabel}
          </Button>

          {/* Payment Notice */}
          <p className="text-center text-sm text-muted-foreground mt-5 leading-relaxed">
            支付完成后，请保留支付截图。当前为内测阶段，项目包将在人工核验后开始生成。
          </p>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-border flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              SigmaPilot 仅用于学习辅助、思路启发、代码参考和报告草稿生成，不提供代写服务，不承诺竞赛结果。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { X, ShieldCheck, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PAYMENT_URL = "https://mzf.mapay.cc/cashier/e2d6d7e799";

const includedItems = [
  "审题拆解",
  "建模路线",
  "代码框架",
  "图表建议",
  "论文结构参考",
];

export function PaymentModal({ isOpen, onClose }: PaymentModalProps) {
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-lg rounded-3xl bg-card border border-border shadow-2xl shadow-primary/10 animate-in fade-in zoom-in-95 duration-300">
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
            解锁 SigmaPilot 内测体验
          </h2>

          <p className="text-muted-foreground text-center mb-8 text-pretty leading-relaxed">
            支付 <span className="text-primary font-semibold">39 元</span> 后，可获得一次 AI 建模启动方案生成服务，包括审题拆解、建模路线、代码框架、图表建议和论文结构参考。
          </p>

          {/* Included Items */}
          <div className="rounded-2xl bg-secondary/40 border border-border p-5 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-foreground">本次服务包含</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {includedItems.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm text-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Pay Button */}
          <Button
            onClick={handlePay}
            className="w-full py-6 text-lg font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
          >
            立即支付 39 元
          </Button>

          {/* Payment Notice */}
          <p className="text-center text-sm text-muted-foreground mt-5 leading-relaxed">
            支付完成后，请保留支付截图。当前为内测阶段，服务将在人工核验后开通。
          </p>

          {/* Disclaimer */}
          <div className="mt-6 pt-6 border-t border-border flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              SigmaPilot 仅用于学习辅助、思路启发和代码参考，不提供代写服务，不承诺竞赛结果。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useRef } from "react";
import { X, QrCode, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

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
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Content */}
        <div className="p-8 md:p-10">
          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-primary" />
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-3 text-balance">
            支付网关维护中
          </h2>
          
          <p className="text-muted-foreground text-center mb-8 text-pretty">
            为确保交易安全，当前支付网关正在升级维护。请通过以下方式完成支付：
          </p>

          {/* Payment Instructions */}
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">1</span>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">扫码支付</h3>
                <p className="text-muted-foreground text-sm">
                  使用微信或支付宝扫描下方收款码，支付 <span className="text-primary font-semibold">¥39</span>
                </p>
              </div>
            </div>

            {/* QR Code Placeholder */}
            <div className="flex justify-center gap-6">
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <span className="text-xs text-muted-foreground">微信支付</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-28 h-28 rounded-xl bg-secondary/50 border border-border flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-muted-foreground/50" />
                </div>
                <span className="text-xs text-muted-foreground">支付宝</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-semibold text-sm">2</span>
              </div>
              <div>
                <h3 className="text-foreground font-medium mb-1">填写备注</h3>
                <p className="text-muted-foreground text-sm">
                  在付款备注中留下您的 <span className="text-primary font-medium">接收邮箱</span>，我们将在 30 分钟内发送分析报告
                </p>
              </div>
            </div>

            {/* Email Reminder */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20">
              <Mail className="w-5 h-5 text-primary flex-shrink-0" />
              <p className="text-sm text-foreground">
                <span className="font-medium">重要提示：</span>
                <span className="text-muted-foreground"> 请务必在备注中填写正确的邮箱地址，否则无法收到分析结果</span>
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border">
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full py-5 border-border hover:bg-secondary"
            >
              我已完成支付
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-4">
              如有疑问，请联系客服：support@modelpilot.ai
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

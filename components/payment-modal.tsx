"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import QRCode from "qrcode";
import {
  X,
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProductType } from "@/lib/products";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  productType: ProductType;
  title?: string;
  description?: string;
  priceLabel?: string;
  items?: string[];
  /** 支付成功回调 */
  onPaid?: () => void;
}

type Stage = "loading" | "scan" | "success" | "error";

export function PaymentModal({
  isOpen,
  onClose,
  productType,
  title = "解锁 SigmaPilot 完整项目包",
  description = "支付后将为你生成一套完整的建模报告初稿与配套材料。",
  priceLabel = "299 元",
  items = [],
  onPaid,
}: PaymentModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [stage, setStage] = useState<Stage>("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [outTradeNo, setOutTradeNo] = useState("");

  const clearPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  // 发起下单 + 生成二维码
  const startPayment = useCallback(async () => {
    setStage("loading");
    setErrorMsg("");
    setQrDataUrl("");
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productType }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "发起支付失败，请稍后再试");
        setStage("error");
        return;
      }

      // 将码支付返回的支付链接渲染为二维码
      const dataUrl = await QRCode.toDataURL(data.qrCode, {
        width: 240,
        margin: 1,
        color: { dark: "#09090b", light: "#ffffff" },
      });
      setQrDataUrl(dataUrl);
      setOutTradeNo(data.outTradeNo);
      setStage("scan");
    } catch {
      setErrorMsg("网络异常，请检查网络后重试");
      setStage("error");
    }
  }, [productType]);

  // 轮询订单状态
  useEffect(() => {
    if (stage !== "scan" || !outTradeNo) return;

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(
          `/api/payment/status?out_trade_no=${encodeURIComponent(outTradeNo)}`,
        );
        const data = await res.json();
        if (res.ok && data.paid) {
          clearPolling();
          setStage("success");
          onPaid?.();
        }
      } catch {
        // 忽略单次轮询错误，继续重试
      }
    }, 3000);

    return clearPolling;
  }, [stage, outTradeNo, clearPolling, onPaid]);

  // 弹窗打开时自动发起支付；关闭时重置
  useEffect(() => {
    if (isOpen) {
      startPayment();
      document.body.style.overflow = "hidden";
    } else {
      clearPolling();
      setStage("loading");
      setQrDataUrl("");
      setOutTradeNo("");
      setErrorMsg("");
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, startPayment, clearPolling]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === modalRef.current) onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      ref={modalRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-md"
    >
      <div className="relative w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          aria-label="关闭弹窗"
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-secondary transition-colors z-10"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <div className="p-8">
          {/* 标题区 */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-foreground text-center mb-2 text-balance">
            {title}
          </h2>
          <p className="text-sm text-muted-foreground text-center mb-6 text-pretty leading-relaxed">
            {description}
          </p>

          {/* 加载态 */}
          {stage === "loading" && (
            <div className="flex flex-col items-center justify-center py-10 gap-3">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-sm text-muted-foreground">正在生成支付二维码...</p>
            </div>
          )}

          {/* 扫码态 */}
          {stage === "scan" && (
            <div className="flex flex-col items-center">
              <div className="rounded-2xl border border-border p-4 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrDataUrl || "/placeholder.svg"} alt="微信支付二维码" width={220} height={220} />
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className="text-2xl font-extrabold text-primary">¥{priceLabel.replace(/[^0-9.]/g, "")}</span>
              </div>
              <p className="text-sm text-foreground font-medium mt-2">请使用微信扫码支付</p>
              <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                正在等待支付结果，支付成功后将自动开通
              </div>

              {items.length > 0 && (
                <div className="w-full mt-5 pt-5 border-t border-border">
                  <div className="flex flex-wrap gap-1.5 justify-center">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 成功态 */}
          {stage === "success" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <CheckCircle2 className="w-16 h-16 text-primary" />
              <h3 className="text-lg font-bold text-foreground">支付成功</h3>
              <p className="text-sm text-muted-foreground text-center">
                你的订单已开通，可前往「我的项目」查看进度。
              </p>
              <Button onClick={onClose} className="w-full py-5 btn-gradient border-0 mt-2">
                完成
              </Button>
            </div>
          )}

          {/* 错误态 */}
          {stage === "error" && (
            <div className="flex flex-col items-center justify-center py-8 gap-4">
              <AlertCircle className="w-12 h-12 text-destructive" />
              <p className="text-sm text-muted-foreground text-center">{errorMsg}</p>
              <Button onClick={startPayment} variant="outline" className="gap-2 bg-transparent">
                <RefreshCw className="w-4 h-4" />
                重新发起支付
              </Button>
            </div>
          )}

          {/* 免责声明 */}
          <div className="mt-6 pt-5 border-t border-border flex items-start gap-2.5">
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

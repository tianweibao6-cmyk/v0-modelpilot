"use client";

import { useState, useCallback } from "react";
import { UploadZone } from "@/components/upload-zone";
import { FeatureCards } from "@/components/feature-cards";
import { PricingCard } from "@/components/pricing-card";
import { PaymentModal } from "@/components/payment-modal";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePurchase = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar onPurchase={handlePurchase} />
      <HeroSection onPurchase={handlePurchase} />
      
      {/* Upload Section */}
      <section id="upload" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              上传赛题，获取建模参考
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              拖拽或点击上传赛题文件，SigmaPilot 将为你生成审题拆解、建模思路和代码框架参考
            </p>
          </div>
          <UploadZone onPurchase={handlePurchase} />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              核心功能
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4 text-balance">
              全流程建模学习辅助
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              六大功能模块，从审题到论文结构，提供全面的学习参考
            </p>
          </div>
          <FeatureCards />
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              定价方案
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4 text-balance">
              简单透明的定价
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              无需订阅，无隐藏费用，39 元获取完整分析报告
            </p>
          </div>
          <PricingCard onPurchase={handlePurchase} />
        </div>
      </section>

      {/* Disclaimer Section */}
      <section className="py-12 px-4 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-xl bg-card border border-border">
            <AlertCircle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-foreground font-semibold mb-2">免责声明</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                SigmaPilot 仅用于学习辅助、思路启发和代码参考，不提供代写服务，不承诺竞赛结果。
                所有生成内容仅供学习参考，用户需自行判断和验证其准确性与适用性。
                使用本工具所产生的任何结果，均由用户自行承担责任。
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
      />
    </main>
  );
}

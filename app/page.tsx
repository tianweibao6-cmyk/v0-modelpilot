"use client";

import { useState, useCallback } from "react";
import { UploadZone } from "@/components/upload-zone";
import { FeatureCards } from "@/components/feature-cards";
import { PricingCard } from "@/components/pricing-card";
import { PaymentModal } from "@/components/payment-modal";
import { HeroSection } from "@/components/hero-section";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function Home() {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handlePurchase = useCallback(() => {
    setIsPaymentModalOpen(true);
  }, []);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      
      {/* Upload Section */}
      <section id="upload" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
              上传赛题，开启 AI 建模之旅
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              拖拽或点击上传赛题文件，ModelPilot 将在秒级响应为你生成完整的建模思路与代码框架
            </p>
          </div>
          <UploadZone />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-4 bg-card/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary text-sm font-semibold tracking-wider uppercase">
              核心能力
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mt-4 mb-4 text-balance">
              为数模竞赛而生的 AI 引擎
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto text-pretty">
              四大核心模块，覆盖从题目分析到论文输出的全流程
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
              一次投入，逆袭赛场
            </h2>
            <p className="text-muted-foreground text-lg text-pretty">
              无需订阅，无隐藏费用，39 元解锁全部能力
            </p>
          </div>
          <PricingCard onPurchase={handlePurchase} />
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

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { PaymentModal } from "@/components/payment-modal";
import {
  WorkbenchSidebar,
  WorkbenchMobileNav,
  type WorkbenchView,
} from "@/components/workbench-sidebar";
import { OverviewView } from "@/components/workbench/overview-view";
import { ProjectPackView } from "@/components/workbench/project-pack-view";
import { DiagramGenerator } from "@/components/workbench/diagram-generator";
import { PlaceholderView } from "@/components/workbench/placeholder-view";
import { PricingView } from "@/components/workbench/pricing-view";

type PaymentConfig = {
  title: string;
  description: string;
  priceLabel: string;
  payButtonLabel: string;
  items: string[];
};

const projectPackPayment: PaymentConfig = {
  title: "解锁 SigmaPilot 完整项目包",
  description:
    "支付 299 元后，将为你生成一套完整的建模报告初稿与配套材料，包括论文初稿、Python 代码、图表文件与质量检查报告。",
  priceLabel: "299 元",
  payButtonLabel: "立即支付 299 元",
  items: [
    "Word / LaTeX 论文初稿",
    "Python 代码",
    "图表文件",
    "中间结果表格",
    "参考文献与附录",
    "AI 使用说明",
    "质量检查报告",
  ],
};

const diagramPayment: PaymentConfig = {
  title: "解锁更多图示生成",
  description:
    "免费体验额度已用完。支付 9.9 元可继续生成机制图、流程图、技术路线图等图示，并下载 PNG / SVG。",
  priceLabel: "9.9 元",
  payButtonLabel: "立即支付 9.9 元",
  items: ["机制图", "流程图", "技术路线图", "研究框架图", "变量关系图"],
};

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<WorkbenchView>("overview");
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig>(projectPackPayment);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 完整项目包：需先登录
  const handleProjectPack = useCallback(() => {
    if (!user) {
      router.push("/login?redirect=/");
      return;
    }
    setPaymentConfig(projectPackPayment);
    setIsPaymentOpen(true);
  }, [user, router]);

  // 机制图/流程图免费额度用尽后的付费
  const handleDiagramLocked = useCallback(() => {
    if (!user) {
      router.push("/login?redirect=/");
      return;
    }
    setPaymentConfig(diagramPayment);
    setIsPaymentOpen(true);
  }, [user, router]);

  const handleSelect = useCallback((next: WorkbenchView) => {
    setView(next);
  }, []);

  const renderView = () => {
    switch (view) {
      case "overview":
        return (
          <OverviewView
            onProjectPack={handleProjectPack}
            onMechanism={() => setView("mechanism")}
            onNavigate={handleSelect}
          />
        );
      case "project-pack":
        return <ProjectPackView onSubmit={handleProjectPack} />;
      case "mechanism":
        return (
          <DiagramGenerator
            title="机制图生成"
            description="粘贴论文摘要、研究主题或方法描述，快速生成精美机制图与技术路线图"
            inputPlaceholder="粘贴论文摘要、研究主题或方法描述..."
            optionLabel="选择图示类型"
            generateLabel="生成图示"
            onLocked={handleDiagramLocked}
            options={[
              { id: "mechanism", label: "机制图" },
              { id: "roadmap", label: "技术路线图" },
              { id: "framework", label: "研究框架图" },
              { id: "variable", label: "变量关系图" },
            ]}
          />
        );
      case "flowchart":
        return (
          <DiagramGenerator
            title="流程图生成"
            description="描述流程、算法步骤或模型步骤，快速生成清晰的流程图"
            inputPlaceholder="描述流程、算法步骤或模型步骤..."
            optionLabel="选择风格"
            generateLabel="生成流程图"
            onLocked={handleDiagramLocked}
            options={[
              { id: "academic", label: "学术简洁" },
              { id: "tech-blue", label: "科技蓝" },
              { id: "mono", label: "黑白论文风" },
            ]}
          />
        );
      case "projects":
        return <PlaceholderView type="projects" user={user} />;
      case "downloads":
        return <PlaceholderView type="downloads" user={user} />;
      case "orders":
        return <PlaceholderView type="orders" user={user} />;
      case "pricing":
        return (
          <PricingView
            onProjectPack={handleProjectPack}
            onMechanism={() => setView("mechanism")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <WorkbenchSidebar active={view} onSelect={handleSelect} user={user} />

      <div className="flex-1 flex flex-col min-w-0">
        <WorkbenchMobileNav active={view} onSelect={handleSelect} />

        <main className="flex-1 px-5 md:px-8 py-8">{renderView()}</main>

        {/* 页脚免责声明（弱视觉） */}
        <footer className="border-t border-border px-5 md:px-8 py-6">
          <p className="text-xs text-muted-foreground/80 leading-relaxed max-w-4xl">
            SigmaPilot 仅用于学习辅助、思路启发、代码参考和报告草稿生成，不提供代写服务，不承诺竞赛结果。用户需自行遵守所在学校、赛事和平台规则。
          </p>
        </footer>
      </div>

      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        title={paymentConfig.title}
        description={paymentConfig.description}
        priceLabel={paymentConfig.priceLabel}
        payButtonLabel={paymentConfig.payButtonLabel}
        items={paymentConfig.items}
      />
    </div>
  );
}

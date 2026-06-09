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
import { ProjectsView } from "@/components/workbench/projects-view";
import type { ProductType } from "@/lib/products";

type PaymentConfig = {
  productType: ProductType;
  title: string;
  description: string;
  priceLabel: string;
  items: string[];
};

const projectPackPayment: PaymentConfig = {
  productType: "project_pack",
  title: "解锁 SigmaPilot 完整项目包",
  description:
    "支付 299 元后，将为你生成一套完整的建模报告初稿与配套材料，包括论文初稿、Python 代码、图表文件与质量检查报告。",
  priceLabel: "299 元",
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
  productType: "diagram",
  title: "解锁论文图示生成",
  description:
    "支付 9.9 元生成一次论文图示，可选研究框架图、技术路线图、机制路径图、模型流程图和变量关系图，并下载 PNG / SVG。",
  priceLabel: "9.9 元",
  items: [
    "研究框架图",
    "技术路线图",
    "机制路径图",
    "模型流程图",
    "变量关系图",
    "PNG / SVG 下载",
  ],
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

  // 论文图示：每次生成均需付费，需先登录
  const handleDiagramPay = useCallback(() => {
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

  // 支付成功后刷新用户态（套餐状态可能已变更）
  const handlePaid = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.auth.getUser();
    setUser(data.user);
  }, []);

  const renderView = () => {
    switch (view) {
      case "overview":
        return (
          <OverviewView
            onProjectPack={handleProjectPack}
            onDiagram={() => setView("diagram")}
          />
        );
      case "project-pack":
        return <ProjectPackView onSubmit={handleProjectPack} />;
      case "diagram":
        return (
          <DiagramGenerator
            title="论文图示生成"
            description="粘贴论文摘要、研究主题或方法描述，快速生成论文常用图示。"
            inputPlaceholder="粘贴论文摘要、研究主题、方法描述或模型步骤..."
            typeLabel="图示类型"
            typeOptions={[
              { id: "framework", label: "研究框架图" },
              { id: "roadmap", label: "技术路线图" },
              { id: "mechanism", label: "机制路径图" },
              { id: "model-flow", label: "模型流程图" },
              { id: "variable", label: "变量关系图" },
            ]}
            styleLabel="图示风格"
            styleOptions={[
              { id: "academic", label: "学术简洁" },
              { id: "tech-blue", label: "科技蓝" },
              { id: "mono", label: "黑白论文风" },
            ]}
            generateLabel="生成图示"
            priceLabel="¥9.9 / 次"
            onPay={handleDiagramPay}
          />
        );
      case "projects":
        return <ProjectsView user={user} />;
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
        productType={paymentConfig.productType}
        title={paymentConfig.title}
        description={paymentConfig.description}
        priceLabel={paymentConfig.priceLabel}
        items={paymentConfig.items}
        onPaid={handlePaid}
      />
    </div>
  );
}

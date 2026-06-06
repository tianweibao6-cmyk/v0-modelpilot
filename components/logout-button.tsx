"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <Button
      onClick={handleLogout}
      variant="outline"
      className="gap-2 bg-transparent border-border text-foreground hover:bg-secondary"
    >
      <LogOut className="w-4 h-4" />
      退出登录
    </Button>
  );
}

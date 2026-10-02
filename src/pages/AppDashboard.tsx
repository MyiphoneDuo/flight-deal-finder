import { BellRing, CheckCircle2, LogOut, Plane, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { DawnHalo } from "@/components/DawnHalo";
import { PlanCards } from "@/components/PlanCards";
import { usePageMeta } from "@/hooks/use-page-meta";
import { supabase } from "@/integrations/supabase/client";
import { useAuthenticatedUser } from "@/lib/auth";

export default function AppDashboard() {
  usePageMeta({
    title: "Dashboard — Flight Price Notifier",
    description: "Your Flight Price Notifier dashboard.",
    ogTitle: "Dashboard — Flight Price Notifier",
    ogDescription: "Manage your flight fare alerts.",
    twitterCard: "summary",
  });
  const user = useAuthenticatedUser();
  const navigate = useNavigate();
  // ECPay sends the browser back via /ecpay-result → 302 → /app?purchase=success|failed.
  // This banner is UX only — the subscription is activated by the server-to-server callback.
  const [purchase] = useState(() => {
    const v = new URLSearchParams(window.location.search).get("purchase");
    if (v) window.history.replaceState(null, "", window.location.pathname);
    return v;
  });

  async function handleSignOut() {
    await supabase.auth.signOut();
    await navigate("/sign-in", { replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dawn-sky text-foreground">
      <DawnHalo className="right-[-160px] top-[-120px] size-[520px] opacity-70" />
      <header className="relative z-10 border-b border-white/50 bg-white/30 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5 font-semibold">
            <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-violet)]">
              <Plane className="size-4" />
            </span>
            <span className="hidden font-display text-xl sm:inline">Flight Price Notifier</span>
            <span className="font-display text-xl sm:hidden">FPN</span>
          </div>
          <Button variant="quiet" onClick={handleSignOut}>
            <LogOut /> Sign Out
          </Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-4 break-words font-display text-4xl font-semibold sm:text-6xl">
          Hi {user.email}
        </h1>
        <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">
          選一條航線、設定你的目標價，月訂閱 NT$300（綠界信用卡定期定額）。每 30 分鐘檢查一次票價，達標時寄信通知你。
        </p>
        {purchase === "success" && (
          <div className="mt-8 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 text-sm">
            <CheckCircle2 className="size-4 text-primary" /> 付款完成！訂閱啟用中，幾秒內就會顯示「已訂閱」，並寄一封確認信給你。
          </div>
        )}
        {purchase === "failed" && (
          <div className="mt-8 flex items-center gap-2 rounded-2xl border border-white/70 bg-white/60 px-5 py-4 text-sm text-destructive">
            <TriangleAlert className="size-4" /> 付款沒有完成，你可以在下方按「完成付款」再試一次。
          </div>
        )}
        <PlanCards email={user.email ?? ""} justPaid={purchase === "success"} />
        <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground">
          <BellRing className="size-4 text-primary" /> 通知會寄到 {user.email}
        </div>
      </main>
    </div>
  );
}

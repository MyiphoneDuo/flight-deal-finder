import { BellRing, LogOut, Plane, Radar } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { DawnHalo } from "@/components/DawnHalo";
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

  async function handleSignOut() {
    await supabase.auth.signOut();
    await navigate("/sign-in", { replace: true });
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-dawn-sky text-foreground">
      <DawnHalo className="right-[-160px] top-[-120px] size-[520px] opacity-70" />
      <header className="relative z-10 border-b border-white/50 bg-white/30 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5 font-semibold"><span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[var(--shadow-violet)]"><Plane className="size-4" /></span><span className="hidden font-display text-xl sm:inline">Flight Price Notifier</span><span className="font-display text-xl sm:hidden">FPN</span></div>
          <Button variant="quiet" onClick={handleSignOut}><LogOut /> Sign Out</Button>
        </div>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-4 break-words font-display text-4xl font-semibold sm:text-6xl">Hi {user.email}</h1>
        <section className="glass mt-12 max-w-3xl rounded-3xl p-7 sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-full bg-[radial-gradient(circle_at_50%_40%,var(--dawn-sun),var(--dawn-apricot))] text-primary shadow-[0_0_24px_4px_color-mix(in_oklab,var(--dawn-sun)_70%,transparent)]"><Radar className="size-6" /></div>
          <h2 className="mt-8 text-xl font-semibold sm:text-2xl">你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Your dashboard is coming soon. Route-subscription will be added in the next milestone.</p>
          <div className="mt-8 flex items-center gap-2 border-t border-white/70 pt-6 text-sm text-muted-foreground"><BellRing className="size-4 text-primary" /> Fare alerts will appear here.</div>
        </section>
      </main>
    </div>
  );
}
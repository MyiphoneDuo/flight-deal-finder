import { BellRing, LogOut, Plane, Radar } from "lucide-react";
import { useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
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
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/80 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <div className="flex items-center gap-2.5 font-semibold"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Plane className="size-4" /></span><span className="hidden sm:inline">Flight Price Notifier</span><span className="sm:hidden">FPN</span></div>
          <Button variant="quiet" onClick={handleSignOut}><LogOut /> Sign Out</Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Dashboard</p>
        <h1 className="mt-4 break-words text-3xl font-semibold sm:text-5xl">Hi {user.email}</h1>
        <section className="mt-12 max-w-3xl rounded-lg border border-border bg-card p-7 sm:p-10">
          <div className="flex size-12 items-center justify-center rounded-md bg-accent text-primary"><Radar className="size-6" /></div>
          <h2 className="mt-8 text-xl font-semibold sm:text-2xl">你的航線追蹤儀表板即將上線 — 下一個里程碑會加上訂閱航線的功能。</h2>
          <p className="mt-4 max-w-2xl leading-7 text-muted-foreground">Your dashboard is coming soon. Route-subscription will be added in the next milestone.</p>
          <div className="mt-8 flex items-center gap-2 border-t border-border pt-6 text-sm text-muted-foreground"><BellRing className="size-4 text-primary" /> Fare alerts will appear here.</div>
        </section>
      </main>
    </div>
  );
}
import { ArrowRight, BellRing, Eye, Plane, XCircle } from "lucide-react";
import { Link } from "react-router";

import { Button } from "@/components/ui/button";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function Index() {
  usePageMeta({
    title: "Flight Price Notifier — 機票降價通知",
    description: "設定航線與目標價，機票降價就通知你。",
    ogTitle: "Flight Price Notifier — 機票降價通知",
    ogDescription: "Set a route and a target price — we email you when the fare drops.",
    twitterCard: "summary_large_image",
  });

  const features = [
    { icon: Eye, title: "盯緊熱門航線", subtitle: "Always-on route watching", body: "持續監控台北出發的熱門航線（東京、首爾），自動抓最低票價。", number: "01" },
    { icon: BellRing, title: "達標自動通知", subtitle: "Target-price email alerts", body: "低於你設定的目標價，就寄 email 提醒你，附上立即訂購連結。", number: "02" },
    { icon: XCircle, title: "隨時取消", subtitle: "Cancel anytime", body: "月訂閱制，不想用隨時停，沒有綁約。", number: "03" },
  ];

  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <header className="relative z-20 border-b border-border/70">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-5 sm:px-8">
          <Link to="/" className="flex items-center gap-2.5 font-semibold"><span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Plane className="size-4" /></span><span className="hidden sm:inline">Flight Price Notifier</span><span className="sm:hidden">FPN</span></Link>
          <Button asChild variant="quiet"><Link to="/sign-in">Sign in / 登入 <ArrowRight /></Link></Button>
        </div>
      </header>

      <main>
        <section className="relative mx-auto flex min-h-[690px] max-w-6xl flex-col justify-center px-5 py-24 sm:px-8 lg:min-h-[760px]">
          <div className="pointer-events-none absolute left-1/2 top-0 h-[620px] w-[900px] -translate-x-1/2 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--primary)_18%,transparent),transparent_65%)]" />
          <div className="relative z-10 max-w-4xl animate-rise">
            <p className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary"><span className="h-px w-8 bg-primary" /> Taipei departures · Fare monitoring</p>
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.03] sm:text-7xl lg:text-8xl">Flight Price<br/><span className="text-primary">Notifier</span></h1>
            <p className="mt-8 max-w-2xl text-2xl font-medium leading-relaxed text-foreground sm:text-3xl">設定航線與目標價，<br className="hidden sm:block"/>機票降價就通知你</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">Set a route and a target price — we email you when the fare drops.</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Button asChild variant="hero" size="lg"><Link to="/sign-up">Start watching fares <ArrowRight /></Link></Button><span className="text-sm text-muted-foreground">Tokyo · Seoul · More soon</span></div>
          </div>

          <div className="pointer-events-none absolute bottom-6 right-5 hidden h-72 w-[46%] lg:block" aria-hidden="true">
            <svg viewBox="0 0 520 250" className="h-full w-full overflow-visible">
              <path d="M28 190 C 145 40, 360 30, 490 152" fill="none" stroke="var(--flight-line)" strokeWidth="1.5" className="animate-route" />
              <circle cx="28" cy="190" r="5" fill="var(--primary)"/><circle cx="490" cy="152" r="5" fill="var(--primary)"/>
              <text x="12" y="218" fill="var(--muted-foreground)" fontSize="12">TPE</text><text x="476" y="180" fill="var(--muted-foreground)" fontSize="12">NRT</text>
              <g transform="translate(250 57) rotate(10)"><path d="M-20 1 L20 -8 L25 -2 L4 9 L-1 24 L-7 25 L-5 9 L-20 6 Z" fill="var(--primary)"/></g>
            </svg>
          </div>
        </section>

        <section className="border-y border-border bg-surface py-24">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="mb-12 max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">How it works</p><h2 className="mt-3 text-3xl font-semibold sm:text-4xl">花少一點，飛遠一點。</h2></div>
            <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
              {features.map((feature, index) => (
                <article key={feature.title} className="group relative min-h-72 bg-card p-7 transition-colors hover:bg-surface-raised sm:p-8">
                  <span className="absolute right-6 top-6 text-xs font-medium text-muted-foreground">{feature.number}</span>
                  <feature.icon className="mb-10 size-7 text-primary" />
                  <h3 className="text-xl font-semibold">{feature.title}</h3><p className="mt-1 text-xs font-medium uppercase tracking-[0.12em] text-primary">{feature.subtitle}</p>
                  <p className="mt-5 text-sm leading-7 text-muted-foreground">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="mx-auto flex max-w-6xl items-center justify-between px-5 py-8 text-xs text-muted-foreground sm:px-8"><span>© 2026 Flight Price Notifier</span><span>Taipei · Taiwan</span></footer>
    </div>
  );
}

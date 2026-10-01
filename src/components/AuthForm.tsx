import { useState, type FormEvent } from "react";
import { LoaderCircle, Mail, Plane, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignUp = mode === "sign-up";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const result = isSignUp
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (result.error) {
      setError(result.error.message);
      return;
    }

    await navigate("/app", { replace: true });
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-5 py-16">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,color-mix(in_oklab,var(--primary)_16%,transparent),transparent_38%)]" />
      <div className="relative w-full max-w-md animate-rise">
        <Link to="/" className="mb-10 flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground"><Plane className="size-4" /></span>
          Flight Price Notifier
        </Link>
        <section className="rounded-lg border border-border bg-card p-6 shadow-2xl shadow-primary/5 sm:p-8">
          <div className="mb-7">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">{isSignUp ? "Create account" : "Welcome back"}</p>
            <h1 className="text-2xl font-semibold text-foreground">{isSignUp ? "Sign up / 註冊" : "Sign in / 登入"}</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{isSignUp ? "開始追蹤符合預算的機票。" : "登入後查看你的航線追蹤狀態。"}</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-foreground">Email</label>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" className="h-11 bg-background" />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <Input id="password" type="password" autoComplete={isSignUp ? "new-password" : "current-password"} minLength={6} required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 6 characters" className="h-11 bg-background" />
            </div>
            {error && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive-foreground">{error}</p>}
            <Button type="submit" variant="hero" size="lg" disabled={loading} className="w-full">
              {loading ? <LoaderCircle className="animate-spin" /> : <Mail />}
              {loading ? "Please wait…" : isSignUp ? "Create account / 建立帳號" : "Sign in / 登入"}
            </Button>
          </form>
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <span>{isSignUp ? "Already have an account?" : "New here?"}</span>
            <Link to={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-primary hover:text-primary-hover">
              {isSignUp ? "Sign in" : "Create account"}
            </Link>
          </div>
        </section>
        <p className="mt-5 flex items-center justify-center gap-2 text-xs text-muted-foreground"><ShieldCheck className="size-4" /> Secure account access powered by Supabase</p>
      </div>
    </main>
  );
}
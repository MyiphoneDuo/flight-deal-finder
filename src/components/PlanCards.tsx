import { BellRing, Check, Loader2, Plane } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// The browser never holds AWS credentials — it only talks to this API Gateway endpoint.
const API_URL =
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) ??
  "https://3paf1h3k8l.execute-api.us-east-1.amazonaws.com";

type PlanName = "tokyo" | "seoul";

const PLANS: { name: PlanName; label: string; route: string; hint: number }[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 7000 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 6400 },
];

type Subscription = { route: string; plan_name: PlanName; target_price: number; currency: string };

function PlanCard({
  plan,
  email,
  current,
  onSaved,
}: {
  plan: (typeof PLANS)[number];
  email: string;
  current?: Subscription | undefined;
  onSaved: (s: Subscription) => void;
}) {
  const [target, setTarget] = useState<string>(current ? String(current.target_price) : "");
  const [editing, setEditing] = useState(!current);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (current) {
      setTarget(String(current.target_price));
      setEditing(false);
    }
  }, [current]);

  async function save() {
    const value = Number(target);
    if (!Number.isFinite(value) || value <= 0) {
      setError("請輸入有效的目標價（新台幣）");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/subscribe`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, plan_name: plan.name, target_price: Math.round(value) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "訂閱失敗");
      onSaved({
        route: data.route,
        plan_name: plan.name,
        target_price: data.target_price,
        currency: "TWD",
      });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "訂閱失敗，請稍後再試");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass flex flex-col rounded-3xl p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            {plan.route}
          </p>
          <h3 className="mt-2 font-display text-2xl font-semibold">{plan.label}</h3>
        </div>
        {current ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
            <Check className="size-3" /> 已訂閱
          </span>
        ) : (
          <Plane className="size-5 text-muted-foreground" />
        )}
      </div>

      {current && !editing ? (
        <div className="mt-6 flex flex-1 flex-col">
          <p className="text-sm text-muted-foreground">目前目標價</p>
          <p className="mt-1 text-3xl font-semibold">NT${current.target_price.toLocaleString()}</p>
          <p className="mt-2 text-sm text-muted-foreground">
            票價低於這個價格時，我們會寄信通知你。
          </p>
          <Button variant="quiet" className="mt-6 self-start" onClick={() => setEditing(true)}>
            更新目標價
          </Button>
        </div>
      ) : (
        <div className="mt-6 flex flex-1 flex-col">
          <label className="text-sm text-muted-foreground" htmlFor={`target-${plan.name}`}>
            目標價（新台幣，來回）
          </label>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm font-semibold">NT$</span>
            <Input
              id={`target-${plan.name}`}
              type="number"
              inputMode="numeric"
              min={1}
              placeholder={String(plan.hint)}
              value={target}
              onChange={(e) => setTarget(e.target.value)}
              className="bg-white/70"
            />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            參考：近期最低價約 NT${plan.hint.toLocaleString()}
          </p>
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-6 flex gap-2">
            <Button onClick={save} disabled={saving}>
              {saving ? <Loader2 className="animate-spin" /> : <BellRing />}{" "}
              {current ? "儲存" : "開始追蹤"}
            </Button>
            {current && (
              <Button variant="quiet" onClick={() => setEditing(false)} disabled={saving}>
                取消
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlanCards({ email }: { email: string }) {
  const [subs, setSubs] = useState<Record<string, Subscription>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/subscriptions?email=${encodeURIComponent(email)}`)
      .then((r) => r.json())
      .then((data: { subscriptions?: Subscription[] }) => {
        if (cancelled) return;
        const map: Record<string, Subscription> = {};
        for (const s of data.subscriptions ?? []) map[s.plan_name] = s;
        setSubs(map);
      })
      .catch(() => {})
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [email]);

  if (loading) {
    return (
      <div className="mt-12 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> 載入你的訂閱…
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2">
      {PLANS.map((p) => (
        <PlanCard
          key={p.name}
          plan={p}
          email={email}
          current={subs[p.name]}
          onSaved={(s) => setSubs((prev) => ({ ...prev, [p.name]: s }))}
        />
      ))}
    </div>
  );
}

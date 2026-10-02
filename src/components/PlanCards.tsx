import { BellRing, Check, Clock, CreditCard, Loader2, Plane, RotateCcw, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// The browser never holds AWS credentials — it only talks to this API Gateway endpoint.
const API_URL =
  (import.meta.env["VITE_FLIGHT_API_URL"] as string | undefined) ??
  "https://3paf1h3k8l.execute-api.us-east-1.amazonaws.com";

// Display only — the real charge amount lives in the flight/ecpay secret (amount).
const MONTHLY_PRICE_TWD = 300;

type PlanName = "tokyo" | "seoul" | "london";
type Status = "pending_payment" | "active" | "cancelled" | "expired";

const PLANS: { name: PlanName; label: string; route: string; hint: number }[] = [
  { name: "tokyo", label: "台北 ✈ 東京", route: "TPE-TYO", hint: 7000 },
  { name: "seoul", label: "台北 ✈ 首爾", route: "TPE-SEL", hint: 6400 },
  { name: "london", label: "台北 ✈ 倫敦", route: "TPE-LON", hint: 22600 },
];

type Subscription = {
  route: string;
  plan_name: PlanName;
  target_price: number;
  currency: string;
  subscription_status: Status;
  current_period_end_date?: string | null;
};

/**
 * POST /subscribe. The Lambda answers in one of two ways:
 *  - text/html        → an auto-submitting ECPay checkout form: hand the whole page to it.
 *  - application/json → an in-place target update (already paid / cancelled-in-grace).
 */
async function postSubscribe(email: string, plan: PlanName, target: number) {
  const res = await fetch(`${API_URL}/subscribe`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, plan_name: plan, target_price: target }),
  });
  const type = res.headers.get("content-type") ?? "";
  if (res.ok && type.includes("text/html")) {
    const html = await res.text();
    document.open();
    document.write(html); // the form's inline <script> submits to ECPay's cashier
    document.close();
    return null;
  }
  const data = (await res.json()) as {
    error?: string;
    target_price?: number;
    subscription_status?: Status;
    current_period_end_date?: string | null;
  };
  if (!res.ok) throw new Error(data.error ?? "訂閱失敗");
  return data;
}

function StatusBadge({ sub }: { sub?: Subscription | undefined }) {
  if (!sub) return <Plane className="size-5 text-muted-foreground" />;
  const base = "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold";
  switch (sub.subscription_status) {
    case "active":
      return (
        <span className={`${base} bg-primary text-primary-foreground`}>
          <Check className="size-3" /> 已訂閱（有效）
        </span>
      );
    case "pending_payment":
      return (
        <span className={`${base} bg-amber-100 text-amber-800`}>
          <Clock className="size-3" /> 未完成付款
        </span>
      );
    case "cancelled":
      return (
        <span className={`${base} bg-white/70 text-foreground`}>
          <XCircle className="size-3" /> 已取消
        </span>
      );
    default:
      return (
        <span className={`${base} bg-white/50 text-muted-foreground`}>
          <XCircle className="size-3" /> 已結束
        </span>
      );
  }
}

function PlanCard({
  plan,
  email,
  current,
  onChange,
}: {
  plan: (typeof PLANS)[number];
  email: string;
  current?: Subscription | undefined;
  onChange: (s: Subscription) => void;
}) {
  const status = current?.subscription_status;
  const paid = status === "active" || status === "cancelled";
  const [target, setTarget] = useState<string>(current ? String(current.target_price) : "");
  const [editing, setEditing] = useState(!current || status === "expired");
  const [busy, setBusy] = useState<"save" | "pay" | "cancel" | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (current) {
      setTarget(String(current.target_price));
      setEditing(current.subscription_status === "expired");
    }
  }, [current]);

  async function submit(kind: "save" | "pay", value: number) {
    if (!Number.isFinite(value) || value <= 0) {
      setError("請輸入有效的目標價（新台幣）");
      return;
    }
    setBusy(kind);
    setError(null);
    try {
      const data = await postSubscribe(email, plan.name, Math.round(value));
      if (data === null) return; // navigating to ECPay
      onChange({
        route: plan.route,
        plan_name: plan.name,
        target_price: data.target_price ?? Math.round(value),
        currency: "TWD",
        subscription_status: data.subscription_status ?? status ?? "active",
        current_period_end_date: data.current_period_end_date ?? current?.current_period_end_date ?? null,
      });
      setEditing(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "訂閱失敗，請稍後再試");
    } finally {
      setBusy(null);
    }
  }

  async function cancel() {
    setBusy("cancel");
    setError(null);
    try {
      const res = await fetch(`${API_URL}/cancel`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, route: plan.route }),
      });
      const data = (await res.json()) as {
        error?: string;
        subscription_status?: Status;
        current_period_end_date?: string | null;
      };
      if (!res.ok) throw new Error(data.error ?? "取消失敗");
      if (current) {
        onChange({
          ...current,
          subscription_status: data.subscription_status ?? "cancelled",
          current_period_end_date: data.current_period_end_date ?? current.current_period_end_date ?? null,
        });
      }
      setConfirmCancel(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "取消失敗，請稍後再試");
    } finally {
      setBusy(null);
    }
  }

  const showForm = editing || !current;

  return (
    <div className="glass flex flex-col rounded-3xl p-7">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">{plan.route}</p>
          <h3 className="mt-2 font-display text-2xl font-semibold">{plan.label}</h3>
        </div>
        <StatusBadge sub={current} />
      </div>

      {current && !showForm ? (
        <div className="mt-6 flex flex-1 flex-col">
          <p className="text-sm text-muted-foreground">目前目標價</p>
          <p className="mt-1 text-3xl font-semibold">NT${current.target_price.toLocaleString()}</p>

          {status === "active" && (
            <p className="mt-2 text-sm text-muted-foreground">
              票價低於這個價格時，我們會寄信通知你。
              {current.current_period_end_date && <> 本期至 {current.current_period_end_date}，之後每月自動續扣。</>}
            </p>
          )}
          {status === "pending_payment" && (
            <p className="mt-2 text-sm text-amber-800">
              尚未完成付款，完成後才會開始通知（NT${MONTHLY_PRICE_TWD} / 月）。
            </p>
          )}
          {status === "cancelled" && (
            <p className="mt-2 text-sm text-muted-foreground">
              已取消續訂，有效至 {current.current_period_end_date ?? "本期結束"}（到該日前仍會通知你）。
            </p>
          )}

          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}

          <div className="mt-6 flex flex-wrap gap-2">
            {status === "pending_payment" && (
              <Button onClick={() => submit("pay", current.target_price)} disabled={busy !== null}>
                {busy === "pay" ? <Loader2 className="animate-spin" /> : <CreditCard />} 完成付款
              </Button>
            )}
            <Button variant="quiet" onClick={() => setEditing(true)} disabled={busy !== null}>
              更新目標價
            </Button>
            {status === "active" && !confirmCancel && (
              <Button variant="quiet" onClick={() => setConfirmCancel(true)} disabled={busy !== null}>
                取消訂閱
              </Button>
            )}
          </div>

          {status === "active" && confirmCancel && (
            <div className="mt-4 rounded-2xl border border-white/70 bg-white/50 p-4 text-sm">
              <p>確定取消嗎？之後不會再扣款；已付費的期間內仍會收到通知。</p>
              <div className="mt-3 flex gap-2">
                <Button variant="destructive" size="sm" onClick={cancel} disabled={busy !== null}>
                  {busy === "cancel" && <Loader2 className="animate-spin" />} 確定取消
                </Button>
                <Button variant="quiet" size="sm" onClick={() => setConfirmCancel(false)} disabled={busy !== null}>
                  保留訂閱
                </Button>
              </div>
            </div>
          )}
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
          <p className="mt-2 text-xs text-muted-foreground">參考：近期最低價約 NT${plan.hint.toLocaleString()}</p>
          {!paid && (
            <p className="mt-1 text-xs text-muted-foreground">
              月訂閱 NT${MONTHLY_PRICE_TWD}，透過綠界信用卡定期定額付款，可隨時取消。
            </p>
          )}
          {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
          <div className="mt-6 flex gap-2">
            <Button onClick={() => submit(paid ? "save" : "pay", Number(target))} disabled={busy !== null}>
              {busy ? <Loader2 className="animate-spin" /> : paid ? <BellRing /> : status === "expired" ? <RotateCcw /> : <CreditCard />}{" "}
              {paid ? "儲存" : status === "expired" ? "重新訂閱" : "訂閱並付款"}
            </Button>
            {current && status !== "expired" && (
              <Button variant="quiet" onClick={() => setEditing(false)} disabled={busy !== null}>
                取消
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export function PlanCards({ email, justPaid = false }: { email: string; justPaid?: boolean }) {
  const [subs, setSubs] = useState<Record<string, Subscription>>({});
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const r = await fetch(`${API_URL}/subscriptions?email=${encodeURIComponent(email)}`);
      const data = (await r.json()) as { subscriptions?: Subscription[] };
      const map: Record<string, Subscription> = {};
      for (const s of data.subscriptions ?? []) map[s.plan_name] = s;
      setSubs(map);
    } catch {
      // keep whatever we had
    }
  }, [email]);

  useEffect(() => {
    let cancelled = false;
    void load().finally(() => !cancelled && setLoading(false));
    // Back from ECPay: the server-to-server ReturnURL callback may land a few seconds
    // after the browser does, so re-check a couple of times.
    const timers: number[] = [];
    if (justPaid) {
      timers.push(window.setTimeout(() => void load(), 3000), window.setTimeout(() => void load(), 8000));
    }
    return () => {
      cancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [load, justPaid]);

  if (loading) {
    return (
      <div className="mt-12 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="size-4 animate-spin" /> 載入你的訂閱…
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {PLANS.map((p) => (
        <PlanCard
          key={p.name}
          plan={p}
          email={email}
          current={subs[p.name]}
          onChange={(s) => setSubs((prev) => ({ ...prev, [p.name]: s }))}
        />
      ))}
    </div>
  );
}

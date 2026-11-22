"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Check,
  Zap,
  Star,
  Calendar,
  CreditCard,
  Download,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SubscriptionStatus {
  subscriptionPlan: "free" | "premium";
  billingCycle: "monthly" | "yearly" | null;
  subscriptionExpiresAt: string | null;
}

interface Transaction {
  id: string;
  date: string;
  plan: string;
  amount: string;
  status: "paid" | "failed" | "pending";
  stripeSessionId?: string | null;
}

const FEATURES_FREE = [
  "Up to 3 active menu items",
  "Basic vendor dashboard",
  "Order management",
];

const FEATURES_PREMIUM = [
  "Unlimited active menu items",
  "Premium vendor badge",
  "Featured menu placement",
  "All Free features",
];

const TX_PAGE_SIZE = 4;

// ── Helpers ───────────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  if (status === "paid")
    return (
      <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 w-fit">
        <span className="size-1.5 rounded-full bg-emerald-500" />
        Paid
      </span>
    );
  if (status === "failed")
    return (
      <span className="bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900 rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 w-fit">
        <span className="size-1.5 rounded-full bg-rose-500" />
        Failed
      </span>
    );
  return (
    <span className="bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 rounded-full px-2.5 py-1 text-[11px] font-semibold flex items-center gap-1 w-fit">
      <span className="size-1.5 rounded-full bg-amber-400" />
      Pending
    </span>
  );
}

function formatDate(isoStr: string | null): string {
  if (!isoStr) return "—";
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function daysUntil(isoStr: string | null): number {
  if (!isoStr) return 0;
  const d = new Date(isoStr);
  if (isNaN(d.getTime())) return 0;
  return Math.max(0, Math.ceil((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default function VendorSubscriptionPage() {
  const { data: session } = useSession();
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<"monthly" | "yearly" | null>(null);
  const [downgradeLoading, setDowngradeLoading] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [txPage, setTxPage] = useState(1);

  // Sync token with email
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  const fetchData = useCallback(async () => {
    try {
      const [statusRes, txRes] = await Promise.allSettled([
        api.get<{ success: boolean; data: SubscriptionStatus }>("/api/payments/subscription-status"),
        api.get<{ success: boolean; data: Transaction[] }>("/api/payments/transactions"),
      ]);

      if (statusRes.status === "fulfilled" && statusRes.value?.data) {
        setStatus(statusRes.value.data);
      } else {
        setStatus({ subscriptionPlan: "free", billingCycle: null, subscriptionExpiresAt: null });
      }

      if (txRes.status === "fulfilled" && Array.isArray(txRes.value?.data)) {
        setTransactions(txRes.value.data);
      }
    } catch {
      setStatus({ subscriptionPlan: "free", billingCycle: null, subscriptionExpiresAt: null });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Stripe Checkout
  async function handleUpgrade(billingCycle: "monthly" | "yearly") {
    try {
      setCheckoutLoading(billingCycle);
      const res = await api.post<{ success: boolean; url?: string; message?: string }>(
        "/api/payments/create-checkout-session",
        { billingCycle }
      );

      if (res?.success && res.url) {
        window.location.href = res.url;
      } else {
        toast.error(res?.message || "Failed to open Stripe Checkout.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Could not start payment session.";
      toast.error(msg);
    } finally {
      setCheckoutLoading(null);
    }
  }

  // Downgrade to Free
  async function handleDowngrade() {
    if (!confirm("Are you sure you want to downgrade to the Free plan? You will be limited to 3 active menu items.")) {
      return;
    }
    try {
      setDowngradeLoading(true);
      const res = await api.post<{ success: boolean; message?: string }>("/api/payments/cancel-subscription");
      if (res?.success) {
        toast.success(res.message || "Subscription downgraded to Free plan.");
        await fetchData();
      } else {
        toast.error(res?.message || "Failed to downgrade subscription.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to cancel subscription.";
      toast.error(msg);
    } finally {
      setDowngradeLoading(false);
    }
  }

  // Derived values from real API data
  const plan = status?.subscriptionPlan ?? "free";
  const billingCycle = status?.billingCycle ?? null;
  const expiresAt = status?.subscriptionExpiresAt ?? null;
  const isPremium = plan === "premium";

  const currentPlanLabel = isPremium
    ? billingCycle === "yearly" ? "Premium Yearly" : "Premium Monthly"
    : "Free";

  const totalDays = billingCycle === "yearly" ? 365 : 30;
  const daysLeft = daysUntil(expiresAt);
  const daysElapsed = Math.max(0, totalDays - daysLeft);
  const progressPct = isPremium ? Math.min(100, Math.round((daysElapsed / totalDays) * 100)) : 0;

  // Started date (approximate from expiresAt minus billing period)
  const startedAt = expiresAt
    ? new Date(new Date(expiresAt).getTime() - totalDays * 24 * 60 * 60 * 1000).toISOString()
    : null;

  // Transactions pagination
  const totalTxPages = Math.max(1, Math.ceil(transactions.length / TX_PAGE_SIZE));
  const paginatedTx = transactions.slice(
    (txPage - 1) * TX_PAGE_SIZE,
    txPage * TX_PAGE_SIZE
  );
  const txStart = transactions.length > 0 ? (txPage - 1) * TX_PAGE_SIZE + 1 : 0;
  const txEnd = Math.min(txPage * TX_PAGE_SIZE, transactions.length);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Subscription"
        subtitle="Choose the plan that fits your restaurant."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-5xl w-full mx-auto space-y-7">
        {/* ── Current Subscription Banner ───────────────────────────────── */}
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs">
          <p className="text-[11px] sm:text-xs text-muted-foreground font-medium mb-2">
            Current subscription
          </p>

          {loading ? (
            <div className="space-y-3">
              <div className="w-48 h-7 bg-muted/60 rounded-xl animate-pulse" />
              <div className="w-full h-2 bg-muted/40 rounded-full animate-pulse" />
              <div className="grid grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="space-y-1">
                    <div className="w-16 h-3 bg-muted/40 rounded animate-pulse" />
                    <div className="w-20 h-4 bg-muted/60 rounded animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <h2 className="font-heading text-xl sm:text-2xl font-bold text-foreground">
                    {currentPlanLabel}
                  </h2>
                  {isPremium ? (
                    <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-2.5 py-0.5 text-[11px] font-semibold flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>
                  ) : (
                    <span className="bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700 rounded-full px-2.5 py-0.5 text-[11px] font-semibold">
                      Free
                    </span>
                  )}
                </div>
                {isPremium && expiresAt && (
                  <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                    <span className="text-foreground font-bold">{daysLeft}</span> days left
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {isPremium && (
                <div className="mb-5">
                  <div className="w-full h-2 bg-stone-100 dark:bg-stone-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#c22d2f] to-[#e05638] rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Billing Meta */}
              {isPremium ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
                  {[
                    { label: "Plan", value: currentPlanLabel },
                    { label: "Started on", value: formatDate(startedAt) },
                    { label: "Expires on", value: formatDate(expiresAt) },
                    { label: "Billed", value: billingCycle === "yearly" ? "Annually" : "Monthly" },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[11px] text-muted-foreground font-medium">{label}</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-2.5 p-3.5 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-2xl">
                  <AlertCircle className="size-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 dark:text-amber-300">
                    You are on the <strong>Free plan</strong>. Upgrade to Premium to publish unlimited menu items, get a Premium vendor badge, and boost your restaurant visibility.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* ── Plan Cards ────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Free Plan */}
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Free</p>
              <div className="flex items-end gap-1">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground">Free</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">No payment needed</p>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {FEATURES_FREE.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {!isPremium ? (
                <div className="w-full text-center bg-[#fce8cc] dark:bg-[#3d2a0e] text-[#9a5f1a] dark:text-amber-300 font-semibold text-xs py-2.5 rounded-full">
                  Included with every account
                </div>
              ) : (
                <button
                  type="button"
                  disabled={downgradeLoading}
                  onClick={handleDowngrade}
                  className="w-full border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:bg-stone-50 dark:hover:bg-stone-800/80 font-semibold text-xs py-2.5 rounded-full transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                  {downgradeLoading ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Downgrading...</span>
                    </>
                  ) : (
                    <span>Downgrade to Free</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Premium Monthly */}
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="size-3.5 text-primary" />
                <p className="text-xs font-semibold text-muted-foreground">Premium Monthly</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground">$29.99</span>
                <span className="text-xs text-muted-foreground mb-1.5">/month</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">Billed monthly</p>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {FEATURES_PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {isPremium && billingCycle === "monthly" ? (
                <div className="w-full text-center bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-semibold text-xs py-2.5 rounded-full">
                  Current Plan
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!!checkoutLoading || downgradeLoading}
                  onClick={() => handleUpgrade("monthly")}
                  className="w-full bg-[#c22d2f] hover:bg-[#a82527] text-white font-bold text-xs py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {checkoutLoading === "monthly" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <span>Subscribe Monthly</span>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Premium Yearly — Best Value */}
          <div className="relative bg-white dark:bg-card border-2 border-[#1c4b27] dark:border-[#2e6b3b] rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col">
            {/* Best Value Badge */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
              <span className="bg-[#1c4b27] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm whitespace-nowrap">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                Best Value · Save 20%
              </span>
            </div>

            <div className="mb-4 mt-2">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="size-3.5 text-amber-500" />
                <p className="text-xs font-semibold text-muted-foreground">Premium Yearly</p>
              </div>
              <div className="flex items-end gap-1">
                <span className="font-heading text-3xl sm:text-4xl font-bold text-foreground">$287.90</span>
                <span className="text-xs text-muted-foreground mb-1.5">/year</span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Billed annually, about{" "}
                <span className="font-semibold text-foreground">$23.99/mo</span>
              </p>
            </div>

            <ul className="space-y-2.5 mb-6 flex-1">
              {FEATURES_PREMIUM.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-stone-700 dark:text-stone-300">
                  <Check className="size-3.5 text-emerald-500 mt-0.5 shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              {isPremium && billingCycle === "yearly" ? (
                <div className="w-full text-center bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400 font-semibold text-xs py-2.5 rounded-full">
                  Current Plan
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!!checkoutLoading || downgradeLoading}
                  onClick={() => handleUpgrade("yearly")}
                  className="w-full bg-[#c22d2f] hover:bg-[#a82527] text-white font-bold text-xs py-2.5 rounded-full shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {checkoutLoading === "yearly" ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      <span>Opening Checkout...</span>
                    </>
                  ) : (
                    <span>Subscribe Yearly</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ── Transaction History ───────────────────────────────────────── */}
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl shadow-xs overflow-hidden">
          <div className="flex items-center justify-between px-5 sm:px-6 py-4 sm:py-5 border-b border-stone-100 dark:border-stone-800">
            <div>
              <h3 className="font-heading text-base sm:text-lg font-bold text-foreground">
                Transaction history
              </h3>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5">
                {transactions.length} transaction{transactions.length === 1 ? "" : "s"} in total
              </p>
            </div>
            <button
              type="button"
              onClick={() => toast.info("Invoice download will be available via Stripe Billing Portal.")}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#c22d2f] hover:underline cursor-pointer"
            >
              <Download className="size-3.5" />
              Download all
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className="px-5 sm:px-6 py-12 text-center text-muted-foreground">
              <CreditCard className="size-8 mx-auto text-stone-300 dark:text-stone-600 mb-2" />
              <p className="text-sm font-semibold text-foreground">No transactions recorded yet</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                Once you purchase or update a Premium subscription, your Stripe confirmation receipts will appear here automatically.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 dark:divide-stone-800">
              {paginatedTx.map((tx) => (
                <div key={tx.id} className="px-5 sm:px-6 py-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 mb-2.5">
                    <div>
                      <p className="text-[11px] text-muted-foreground font-medium">Date</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">{tx.date}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-medium">Plan</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">{tx.plan}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-muted-foreground font-medium">Amount</p>
                      <p className="text-xs sm:text-sm font-semibold text-foreground mt-0.5">{tx.amount}</p>
                    </div>
                    <div className="flex justify-start sm:justify-end items-start">
                      <StatusBadge status={tx.status} />
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {tx.stripeSessionId ? (
                      <span className="text-[10px] text-muted-foreground font-mono truncate max-w-xs">
                        Ref: {tx.stripeSessionId}
                      </span>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => toast.info("Invoice receipt can be downloaded once generated by Stripe.")}
                      className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-stone-500 hover:text-foreground transition-colors cursor-pointer ml-auto"
                    >
                      <Download className="size-3" />
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {transactions.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-5 sm:px-6 py-4 border-t border-stone-100 dark:border-stone-800">
              <div>
                <p className="text-xs text-muted-foreground font-medium">
                  Showing {txStart} to {txEnd} of {transactions.length} transactions
                </p>
                <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                  Records come from Stripe confirmations and cannot be edited.
                </p>
              </div>
              {totalTxPages > 1 && (
                <div className="flex items-center gap-1.5 select-none">
                  <button
                    type="button"
                    onClick={() => setTxPage((p) => Math.max(1, p - 1))}
                    disabled={txPage <= 1}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    &lt; Previous
                  </button>
                  {Array.from({ length: totalTxPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setTxPage(p)}
                      className={`size-8 sm:size-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                        p === txPage
                          ? "bg-[#c22d2f] text-white shadow-xs"
                          : "bg-stone-100 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-primary/50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTxPage((p) => Math.min(totalTxPages, p + 1))}
                    disabled={txPage >= totalTxPages}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Billing Note ─────────────────────────────────────────────── */}
        <div className="bg-[#faf6ee] dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 rounded-2xl px-5 py-4 flex items-start sm:items-center gap-3">
          <CreditCard className="size-4 text-muted-foreground shrink-0 mt-0.5 sm:mt-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-foreground">Need to manage your billing?</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Full Stripe billing portal, invoice downloads, and payment method management are handled securely through Stripe.
            </p>
          </div>
          <button
            type="button"
            onClick={() => toast.info("Stripe Customer Billing Portal link will be available here.")}
            className="flex items-center gap-1 text-xs font-semibold text-[#c22d2f] hover:underline shrink-0 cursor-pointer"
          >
            <Calendar className="size-3.5" />
            Manage Billing
          </button>
        </div>
      </main>
    </div>
  );
}

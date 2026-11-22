"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  Star,
  Copy,
  Check,
} from "lucide-react";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!sessionId) return;
    navigator.clipboard.writeText(sessionId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-card text-card-foreground rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/80 overflow-hidden">
          {/* Emerald Top Accent */}
          <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400" />

          <div className="p-6 sm:p-7 flex flex-col items-center text-center gap-4 sm:gap-5">
            {/* Icon */}
            <div className="relative">
              <div className="size-14 sm:size-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shadow-xs">
                <CheckCircle2 className="size-7 sm:size-8" strokeWidth={2} />
              </div>
              <span className="absolute -top-1 -right-1 size-3 rounded-full bg-emerald-400 opacity-75 animate-ping" />
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
                Payment Successful! 🎉
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Your <strong className="text-primary font-semibold">Premium Plan</strong> is now active. You can now publish unlimited menu items on PizzaHub.
              </p>
            </div>

            {/* Note / Sync Info */}
            <div className="w-full bg-amber-500/10 border border-amber-500/20 rounded-2xl px-3.5 py-2.5 text-xs text-amber-800 dark:text-amber-300 text-left flex items-start gap-2.5">
              <Star className="size-3.5 mt-0.5 shrink-0 text-amber-500 fill-amber-500" />
              <span className="leading-snug">
                It may take a few moments for your subscription status to sync across all dashboard pages.
              </span>
            </div>

            {/* Transaction Reference (if session_id exists) */}
            {sessionId && (
              <div className="w-full space-y-1.5 text-left">
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider block px-1">
                  Transaction Reference
                </span>
                <div className="flex items-center gap-2 bg-muted/40 border border-border/70 rounded-xl px-3 py-2 transition-colors">
                  <code className="text-xs font-mono text-foreground/80 flex-1 truncate select-all">
                    {sessionId}
                  </code>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer shrink-0"
                    title={copied ? "Copied!" : "Copy reference ID"}
                    aria-label="Copy reference ID"
                  >
                    {copied ? (
                      <Check className="size-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/dashboard/vendor"
                className="w-full inline-flex items-center justify-center gap-2 bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-full py-2.5 px-4 shadow-xs transition-all text-center"
              >
                <LayoutDashboard className="size-3.5 sm:size-4" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/vendor/subscription"
                className="w-full inline-flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border text-foreground font-semibold text-xs sm:text-sm rounded-full py-2.5 px-4 transition-colors text-center"
              >
                <Star className="size-3.5 sm:size-4 text-amber-500" />
                Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Questions? Email us at{" "}
          <a
            href="mailto:support@pizzahub.com"
            className="text-primary hover:underline font-medium"
          >
            support@pizzahub.com
          </a>
        </p>
      </div>
    </main>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground text-sm">Loading…</div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

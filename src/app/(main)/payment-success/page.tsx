"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle2,
  LayoutDashboard,
  Star,
  Copy,
  Check,
} from "lucide-react";
import { useState } from "react";

// ── Inner component (needs useSearchParams inside Suspense) ──────────────────
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
    <main className="min-h-[calc(100vh-5rem)] bg-[#faf6ee] dark:bg-[#181512] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white dark:bg-[#1e1a16] rounded-3xl shadow-sm border border-[#f0e8d8] dark:border-[#2a2420] overflow-hidden">
          {/* Green top stripe */}
          <div className="h-2 bg-gradient-to-r from-green-400 to-emerald-500" />

          <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="w-14 h-14 text-green-500" strokeWidth={1.5} />
              </div>
              {/* Sparkle dots */}
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 opacity-70 animate-ping" />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1c1a17] dark:text-[#f5ede0]">
                Payment Successful! 🎉
              </h1>
              <p className="text-[#6b5e4e] dark:text-[#9e8e7e] text-base leading-relaxed">
                Your <span className="font-semibold text-[#c22d2f]">Premium subscription</span> is now active.
                You can now publish unlimited menu items on PizzaHub.
              </p>
            </div>

            {/* Note */}
            <div className="w-full bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-sm text-amber-700 dark:text-amber-400 text-left flex gap-2">
              <Star className="w-4 h-4 mt-0.5 shrink-0 text-amber-500" />
              <span>
                It may take a few moments for your subscription status to update across the dashboard.
              </span>
            </div>

            {/* Session ID */}
            {sessionId && (
              <div className="w-full">
                <p className="text-xs font-medium text-[#9e8e7e] dark:text-[#6e5e4e] mb-2 text-left uppercase tracking-wide">
                  Transaction Reference
                </p>
                <div className="flex items-center gap-2 bg-[#fcf8f0] dark:bg-[#15110e] border border-[#e8dcc8] dark:border-[#2a2420] rounded-xl px-4 py-3">
                  <code className="text-xs text-[#4a3f33] dark:text-[#b0a090] flex-1 truncate font-mono">
                    {sessionId}
                  </code>
                  <button
                    onClick={handleCopy}
                    className="shrink-0 text-[#9e8e7e] hover:text-[#c22d2f] transition-colors"
                    title="Copy session ID"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard/vendor"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#c22d2f] hover:bg-[#a82527] text-white font-semibold text-sm rounded-xl px-5 py-3 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
              <Link
                href="/dashboard/vendor/subscription"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-[#231f1b] border border-[#e8dcc8] dark:border-[#2a2420] hover:border-[#c22d2f] dark:hover:border-[#c22d2f] text-[#4a3f33] dark:text-[#d0c0a8] font-semibold text-sm rounded-xl px-5 py-3 transition-colors"
              >
                <Star className="w-4 h-4" />
                Manage Subscription
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-[#9e8e7e] dark:text-[#6e5e4e]">
          Questions? Email us at{" "}
          <a
            href="mailto:support@pizzahub.com"
            className="text-[#c22d2f] hover:underline"
          >
            support@pizzahub.com
          </a>
        </p>
      </div>
    </main>
  );
}

// ── Page export (wraps content in Suspense for useSearchParams) ──────────────
export default function PaymentSuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[calc(100vh-5rem)] bg-[#faf6ee] dark:bg-[#181512] flex items-center justify-center">
          <div className="animate-pulse text-[#9e8e7e]">Loading…</div>
        </main>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}

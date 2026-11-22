"use client";

import Link from "next/link";
import { XCircle, RefreshCw, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-background flex items-center justify-center px-4 py-10 sm:py-16">
      <div className="w-full max-w-[440px]">
        {/* Card */}
        <div className="bg-card text-card-foreground rounded-3xl shadow-lg shadow-black/5 dark:shadow-black/20 border border-border/80 overflow-hidden">
          {/* Amber / Orange Top Accent */}
          <div className="h-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400" />

          <div className="p-6 sm:p-7 flex flex-col items-center text-center gap-4 sm:gap-5">
            {/* Icon */}
            <div className="size-14 sm:size-16 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-xs">
              <XCircle className="size-7 sm:size-8" strokeWidth={2} />
            </div>

            {/* Heading & Subtitle */}
            <div className="space-y-1.5">
              <h1 className="text-xl sm:text-2xl font-heading font-bold text-foreground tracking-tight">
                Payment Cancelled
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
                Your subscription was not activated.{" "}
                <span className="font-semibold text-foreground">
                  No charges were made.
                </span>
              </p>
            </div>

            {/* Safe Note */}
            <div className="w-full bg-emerald-500/10 border border-emerald-500/20 rounded-2xl px-3.5 py-2.5 text-xs text-emerald-800 dark:text-emerald-300 text-left flex items-start gap-2.5">
              <ShieldCheck className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400 mt-0.5" />
              <span className="leading-snug">
                Your payment details were not stored and your account remains safely on the <strong>Free plan</strong>.
              </span>
            </div>

            {/* Troubleshooting Checklist */}
            <div className="w-full bg-muted/40 border border-border/70 rounded-2xl p-3.5 sm:p-4 text-left space-y-2">
              <p className="text-xs font-semibold text-foreground">
                Want to try again?
              </p>
              <ul className="text-xs text-muted-foreground space-y-1.5 list-disc list-inside">
                <li>Verify your card information and expiry date.</li>
                <li>Confirm your bank permits online transactions.</li>
                <li>Try a different payment method if issues persist.</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Link
                href="/dashboard/vendor/subscription"
                className="w-full inline-flex items-center justify-center gap-2 bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-xs sm:text-sm rounded-full py-2.5 px-4 shadow-xs transition-all text-center"
              >
                <RefreshCw className="size-3.5 sm:size-4" />
                Try Again
              </Link>
              <Link
                href="/dashboard/vendor"
                className="w-full inline-flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border text-foreground font-semibold text-xs sm:text-sm rounded-full py-2.5 px-4 transition-colors text-center"
              >
                <LayoutDashboard className="size-3.5 sm:size-4" />
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Need help?{" "}
          <a
            href="mailto:support@pizzahub.com"
            className="text-primary hover:underline font-medium"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}

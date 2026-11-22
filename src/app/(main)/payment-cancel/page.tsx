"use client";

import Link from "next/link";
import { XCircle, RefreshCw, LayoutDashboard, ShieldCheck } from "lucide-react";

export default function PaymentCancelPage() {
  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#faf6ee] dark:bg-[#181512] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Card */}
        <div className="bg-white dark:bg-[#1e1a16] rounded-3xl shadow-sm border border-[#f0e8d8] dark:border-[#2a2420] overflow-hidden">
          {/* Amber top stripe */}
          <div className="h-2 bg-gradient-to-r from-amber-400 to-orange-400" />

          <div className="p-8 sm:p-10 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <div className="w-24 h-24 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center">
              <XCircle className="w-14 h-14 text-amber-500" strokeWidth={1.5} />
            </div>

            {/* Heading */}
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-heading font-bold text-[#1c1a17] dark:text-[#f5ede0]">
                Payment Cancelled
              </h1>
              <p className="text-[#6b5e4e] dark:text-[#9e8e7e] text-base leading-relaxed">
                Your subscription was not activated.{" "}
                <span className="font-semibold text-[#1c1a17] dark:text-[#f5ede0]">
                  No charges were made.
                </span>
              </p>
            </div>

            {/* Safe note */}
            <div className="w-full bg-green-50 dark:bg-green-900/15 border border-green-200 dark:border-green-800/40 rounded-xl px-4 py-3 text-sm text-green-700 dark:text-green-400 text-left flex gap-2">
              <ShieldCheck className="w-4 h-4 mt-0.5 shrink-0 text-green-500" />
              <span>
                Your payment details were not stored and your account remains on the Free plan.
              </span>
            </div>

            {/* What you can do */}
            <div className="w-full bg-[#fcf8f0] dark:bg-[#15110e] border border-[#e8dcc8] dark:border-[#2a2420] rounded-xl px-5 py-4 text-left space-y-2">
              <p className="text-sm font-semibold text-[#1c1a17] dark:text-[#f5ede0]">
                Want to try again?
              </p>
              <ul className="text-sm text-[#6b5e4e] dark:text-[#9e8e7e] space-y-1 list-disc list-inside">
                <li>Check your card details and try again.</li>
                <li>Ensure your bank allows online payments.</li>
                <li>Contact your bank if the issue persists.</li>
              </ul>
            </div>

            {/* CTA Buttons */}
            <div className="w-full flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/dashboard/vendor/subscription"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-[#c22d2f] hover:bg-[#a82527] text-white font-semibold text-sm rounded-xl px-5 py-3 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </Link>
              <Link
                href="/dashboard/vendor"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-white dark:bg-[#231f1b] border border-[#e8dcc8] dark:border-[#2a2420] hover:border-[#c22d2f] dark:hover:border-[#c22d2f] text-[#4a3f33] dark:text-[#d0c0a8] font-semibold text-sm rounded-xl px-5 py-3 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-[#9e8e7e] dark:text-[#6e5e4e]">
          Need help?{" "}
          <a
            href="mailto:support@pizzahub.com"
            className="text-[#c22d2f] hover:underline"
          >
            Contact support
          </a>
        </p>
      </div>
    </main>
  );
}

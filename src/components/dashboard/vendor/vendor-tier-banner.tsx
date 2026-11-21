"use client";

import Link from "next/link";

interface VendorTierBannerProps {
  plan: "free" | "premium";
  activeItems: number;
  loading?: boolean;
}

export function VendorTierBanner({
  plan,
  activeItems,
  loading,
}: VendorTierBannerProps) {
  const isPremium = plan === "premium";
  const maxLimit = 3;
  const percent = isPremium
    ? 100
    : Math.min(100, Math.round((activeItems / maxLimit) * 100));

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
      {/* Left side: Heading, Progress Bar & Info */}
      <div className="flex-1 w-full max-w-2xl">
        {loading ? (
          <div className="flex flex-col gap-2">
            <div className="w-56 h-5 bg-muted/60 rounded animate-pulse" />
            <div className="w-full h-3 bg-muted/50 rounded-full animate-pulse my-1" />
            <div className="w-72 h-3 bg-muted/50 rounded animate-pulse" />
          </div>
        ) : (
          <>
            <h2 className="font-heading text-base sm:text-lg font-bold text-foreground">
              {isPremium ? (
                <>
                  Premium plan:{" "}
                  <span className="text-primary font-extrabold">{activeItems}</span>{" "}
                  active items used
                </>
              ) : (
                <>
                  Free plan:{" "}
                  <span className="text-primary font-extrabold">{activeItems}</span>{" "}
                  of {maxLimit} active items used
                </>
              )}
            </h2>

            {/* Gradient Progress Bar */}
            <div className="w-full h-2.5 sm:h-3 rounded-full bg-stone-100 dark:bg-stone-800/80 overflow-hidden my-2.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-[#c22d2f] transition-all duration-700 ease-out"
                style={{ width: `${percent}%` }}
              />
            </div>

            <p className="text-xs text-muted-foreground font-medium">
              {isPremium
                ? "You have unlimited active menu items with your Premium restaurant tier."
                : "Upgrade to Premium for unlimited active items."}
            </p>
          </>
        )}
      </div>

      {/* Right side: Action Button */}
      <div className="shrink-0">
        <Link
          href="/dashboard/vendor/subscription"
          className="inline-flex items-center justify-center px-6 py-2.5 rounded-full bg-[#c22d2f] hover:bg-[#a82527] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all text-center"
        >
          {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
        </Link>
      </div>
    </div>
  );
}

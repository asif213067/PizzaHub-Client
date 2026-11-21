"use client";

import Link from "next/link";

interface VendorCompactTierBannerProps {
  plan: "free" | "premium";
  activeCount: number;
  loading?: boolean;
}

export function VendorCompactTierBanner({
  plan,
  activeCount,
  loading,
}: VendorCompactTierBannerProps) {
  const isPremium = plan === "premium";
  const maxFree = 3;

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-4 sm:p-5 shadow-xs flex items-center justify-between gap-4">
      {/* Left side text */}
      <div>
        {loading ? (
          <div className="w-52 h-5 bg-muted/60 rounded animate-pulse" />
        ) : (
          <p className="font-heading text-sm sm:text-base font-bold text-foreground">
            {isPremium ? (
              <>
                Premium plan:{" "}
                <span className="text-primary font-extrabold">{activeCount}</span>{" "}
                active items used (Unlimited)
              </>
            ) : (
              <>
                Free plan:{" "}
                <span className="text-primary font-extrabold">{activeCount}</span>{" "}
                of {maxFree} active items used
              </>
            )}
          </p>
        )}
      </div>

      {/* Right side link */}
      <div>
        <Link
          href="/dashboard/vendor/subscription"
          className="text-xs sm:text-sm font-semibold text-[#c22d2f] hover:underline transition-colors shrink-0"
        >
          {isPremium ? "Manage Subscription" : "Upgrade to Premium"}
        </Link>
      </div>
    </div>
  );
}

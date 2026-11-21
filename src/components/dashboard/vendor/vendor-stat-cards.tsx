import { Pizza, CheckCircle, Clock, CheckCircle2, Award } from "lucide-react";
import { VendorStats } from "@/types/vendor";

interface VendorStatCardsProps {
  stats: VendorStats;
  loading?: boolean;
}

export function VendorStatCards({ stats, loading }: VendorStatCardsProps) {
  const cards = [
    {
      title: "Total menu items",
      count: stats.totalItems,
      icon: Pizza,
      isText: false,
    },
    {
      title: "Active menu items",
      count: stats.activeItems,
      icon: CheckCircle,
      isText: false,
    },
    {
      title: "Pending customer orders",
      count: stats.pendingOrders,
      icon: Clock,
      isText: false,
    },
    {
      title: "Accepted orders",
      count: stats.acceptedOrders,
      icon: CheckCircle2,
      isText: false,
    },
    {
      title: "Current plan",
      count: stats.subscriptionPlan === "premium" ? "Premium" : "Free",
      icon: Award,
      isText: true,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-sm"
          >
            {/* Title & subtle icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
                {card.title}
              </span>
              <Icon className="size-4 text-muted-foreground/60" />
            </div>

            {/* Red circular badge matching design reference */}
            <div className="flex items-center">
              {loading ? (
                <div className="size-11 sm:size-12 rounded-full bg-muted/60 animate-pulse" />
              ) : (
                <div
                  className={`size-11 sm:size-12 rounded-full bg-[#c22d2f] text-white font-extrabold flex items-center justify-center shadow-xs select-none ${
                    card.isText ? "text-xs tracking-tight" : "text-base sm:text-lg"
                  }`}
                  title={String(card.count)}
                >
                  {card.count}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

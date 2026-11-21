import { ShoppingBag, Clock, CheckCircle2, XCircle } from "lucide-react";
import { OrderStats } from "@/types/order";

interface StatCardsProps {
  stats: OrderStats;
  loading?: boolean;
}

export function StatCards({ stats, loading }: StatCardsProps) {
  const cards = [
    {
      title: "Total orders",
      count: stats.total,
      icon: ShoppingBag,
    },
    {
      title: "Pending orders",
      count: stats.pending,
      icon: Clock,
    },
    {
      title: "Accepted orders",
      count: stats.accepted,
      icon: CheckCircle2,
    },
    {
      title: "Rejected orders",
      count: stats.rejected,
      icon: XCircle,
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
            {/* Card title & subtle icon */}
            <div className="flex items-center justify-between">
              <span className="text-xs sm:text-sm font-semibold text-stone-700 dark:text-stone-300">
                {card.title}
              </span>
              <Icon className="size-4 text-muted-foreground/60" />
            </div>

            {/* Red circular badge with count matching screenshot */}
            <div className="flex items-center">
              {loading ? (
                <div className="size-11 sm:size-12 rounded-full bg-muted/60 animate-pulse" />
              ) : (
                <div className="size-11 sm:size-12 rounded-full bg-[#c22d2f] text-white font-extrabold text-base sm:text-lg flex items-center justify-center shadow-xs select-none">
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

import { Users, Store, Pizza, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { AdminOverviewStats } from "@/types/admin";

interface AdminStatCardsProps {
  stats: AdminOverviewStats | null;
  loading: boolean;
}

export function AdminStatCards({ stats, loading }: AdminStatCardsProps) {
  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 shadow-xs animate-pulse space-y-3"
          >
            <div className="size-10 rounded-2xl bg-muted/60" />
            <div className="w-20 h-4 bg-muted/50 rounded" />
            <div className="w-28 h-7 bg-muted/60 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Platform Users",
      value: stats.totalUsers,
      sub: `${stats.totalCustomers} Customers · ${stats.totalVendors} Vendors`,
      icon: Users,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-950/40",
      border: "border-blue-100 dark:border-blue-900/40",
    },
    {
      title: "Registered Vendors",
      value: stats.totalVendors,
      sub: `${stats.totalMenuItems} Menu items published`,
      icon: Store,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-50 dark:bg-amber-950/40",
      border: "border-amber-100 dark:border-amber-900/40",
    },
    {
      title: "Menu Items Pending",
      value: stats.pendingMenuItems,
      sub: stats.pendingMenuItems > 0 ? "Requires admin review" : "All items approved",
      icon: stats.pendingMenuItems > 0 ? AlertTriangle : Pizza,
      color: stats.pendingMenuItems > 0 ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400",
      bg: stats.pendingMenuItems > 0 ? "bg-rose-50 dark:bg-rose-950/40" : "bg-emerald-50 dark:bg-emerald-950/40",
      border: stats.pendingMenuItems > 0 ? "border-rose-100 dark:border-rose-900/40" : "border-emerald-100 dark:border-emerald-900/40",
      badge: stats.pendingMenuItems > 0 ? "Action Needed" : null,
    },
    {
      title: "Subscription Revenue",
      value: `$${Number(stats.totalRevenue || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      sub: `${stats.totalTransactions} Total payments processed`,
      icon: DollarSign,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      border: "border-emerald-100 dark:border-emerald-900/40",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 shadow-xs flex flex-col justify-between hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-muted-foreground">{card.title}</span>
              <div className={`size-10 rounded-2xl ${card.bg} ${card.border} border flex items-center justify-center shrink-0`}>
                <Icon className={`size-5 ${card.color}`} />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {card.value}
                </span>
                {card.badge && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 animate-pulse">
                    {card.badge}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">{card.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

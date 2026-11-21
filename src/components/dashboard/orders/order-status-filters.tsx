"use client";

export type OrderStatusFilter = "all" | "pending" | "accepted" | "rejected" | "cancelled";

interface OrderStatusFiltersProps {
  activeFilter: OrderStatusFilter;
  onFilterChange: (filter: OrderStatusFilter) => void;
  counts?: Record<OrderStatusFilter, number>;
}

export function OrderStatusFilters({
  activeFilter,
  onFilterChange,
  counts,
}: OrderStatusFiltersProps) {
  const filterOptions: { label: string; value: OrderStatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "Pending", value: "pending" },
    { label: "Accepted", value: "accepted" },
    { label: "Rejected", value: "rejected" },
    { label: "Cancelled", value: "cancelled" },
  ];

  return (
    <div className="flex items-center gap-2 sm:gap-2.5 overflow-x-auto pb-1 scrollbar-none select-none">
      {filterOptions.map((option) => {
        const isActive = activeFilter === option.value;
        const count = counts ? counts[option.value] : undefined;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onFilterChange(option.value)}
            className={`px-4 sm:px-5 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
              isActive
                ? "bg-[#c22d2f] text-white shadow-xs"
                : "bg-white dark:bg-card border border-stone-200/90 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-primary/50 hover:bg-stone-50 dark:hover:bg-stone-800/80"
            }`}
          >
            {option.label}
            {count !== undefined && count > 0 && (
              <span
                className={`ml-1.5 text-[11px] font-bold ${
                  isActive ? "text-white/90" : "text-muted-foreground"
                }`}
              >
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

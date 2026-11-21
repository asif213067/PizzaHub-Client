import { OrderStats } from "@/types/order";

interface StatusDoughnutChartProps {
  stats: OrderStats;
  loading?: boolean;
}

export function StatusDoughnutChart({ stats, loading }: StatusDoughnutChartProps) {
  const { pending, accepted, rejected, cancelled, total } = stats;

  // Chart configuration
  const items = [
    { label: "Pending", count: pending, color: "#f59e0b" },
    { label: "Accepted", count: accepted, color: "#1b5e3a" },
    { label: "Rejected", count: rejected, color: "#c22d2f" },
    { label: "Cancelled", count: cancelled, color: "#9ca3af" },
  ];

  // SVG dimensions & math
  const size = 160;
  const strokeWidth = 24;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  // Calculate slice angles / offsets
  let accumulatedPercent = 0;
  const slices = items
    .filter((item) => item.count > 0)
    .map((item) => {
      const percent = total > 0 ? item.count / total : 0;
      const strokeDasharray = `${percent * circumference} ${circumference}`;
      const strokeDashoffset = -accumulatedPercent * circumference;
      accumulatedPercent += percent;
      return {
        ...item,
        percent,
        strokeDasharray,
        strokeDashoffset,
      };
    });

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <h3 className="font-heading text-sm sm:text-base font-bold text-foreground mb-4">
        Orders by status
      </h3>

      {loading ? (
        <div className="h-44 flex items-center justify-center">
          <div className="size-32 rounded-full border-4 border-muted border-t-primary animate-spin" />
        </div>
      ) : total === 0 ? (
        <div className="h-44 flex flex-col items-center justify-center text-center p-4">
          <div className="size-16 rounded-full border-4 border-dashed border-stone-200 dark:border-stone-700 flex items-center justify-center text-muted-foreground text-xs font-semibold mb-2">
            0%
          </div>
          <p className="text-xs text-muted-foreground">No orders recorded yet</p>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
          {/* Doughnut SVG */}
          <div className="relative shrink-0 flex items-center justify-center">
            <svg
              width={size}
              height={size}
              viewBox={`0 0 ${size} ${size}`}
              className="transform -rotate-90"
            >
              {/* Background circle track */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-stone-100 dark:text-stone-800/80"
              />

              {/* Data segments */}
              {slices.map((slice) => (
                <circle
                  key={slice.label}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="transparent"
                  stroke={slice.color}
                  strokeWidth={strokeWidth}
                  strokeDasharray={slice.strokeDasharray}
                  strokeDashoffset={slice.strokeDashoffset}
                  strokeLinecap="round"
                  className="transition-all duration-500 ease-out"
                />
              ))}
            </svg>

            {/* Center Summary */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-heading font-extrabold text-foreground">
                {total}
              </span>
              <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wider">
                Orders
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-col gap-2.5 min-w-[130px]">
            {items.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between gap-3 text-xs"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-stone-700 dark:text-stone-300 font-medium">
                    {item.label}
                  </span>
                </div>
                <span className="font-semibold text-foreground">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

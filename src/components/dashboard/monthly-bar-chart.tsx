import { MonthlyOrderCount } from "@/types/order";

interface MonthlyBarChartProps {
  monthlyData: MonthlyOrderCount[];
  loading?: boolean;
}

export function MonthlyBarChart({ monthlyData, loading }: MonthlyBarChartProps) {
  // Find maximum count to scale bars (fallback to 4 if all 0 so bars have clean scale)
  const maxCount = Math.max(...monthlyData.map((d) => d.count), 4);
  const totalCount = monthlyData.reduce((acc, curr) => acc + curr.count, 0);

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
          Orders, last 6 months
        </h3>
        <span className="text-xs text-muted-foreground font-medium">
          {totalCount} total
        </span>
      </div>

      {loading ? (
        <div className="h-44 flex items-end justify-between gap-3 px-4 pb-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-muted/60 rounded-t-xl animate-pulse"
              style={{ height: `${30 + i * 12}%` }}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-2 pt-2">
          {/* Bars Container */}
          <div className="h-36 flex items-end justify-between gap-2.5 sm:gap-4 px-2 sm:px-4 border-b border-stone-200/70 dark:border-stone-800 pb-1">
            {monthlyData.map((data) => {
              // Calculate relative height percentage
              const heightPercent =
                data.count > 0
                  ? Math.max(Math.round((data.count / maxCount) * 100), 12)
                  : 4; // subtle 4% baseline indicator for 0

              return (
                <div
                  key={`${data.year}-${data.monthIndex}`}
                  className="flex-1 flex flex-col items-center h-full justify-end group relative"
                >
                  {/* Hover tooltip */}
                  <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] font-semibold py-0.5 px-2 rounded-md pointer-events-none whitespace-nowrap z-10 shadow-sm">
                    {data.count} {data.count === 1 ? "order" : "orders"}
                  </div>

                  {/* Red vertical bar */}
                  <div
                    className={`w-full max-w-[42px] transition-all duration-500 rounded-t-xl ${
                      data.count > 0
                        ? "bg-[#c22d2f] hover:brightness-110 shadow-xs cursor-pointer"
                        : "bg-stone-200/70 dark:bg-stone-800"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
              );
            })}
          </div>

          {/* Month Labels underneath */}
          <div className="flex items-center justify-between gap-2.5 sm:gap-4 px-2 sm:px-4">
            {monthlyData.map((data) => (
              <span
                key={`label-${data.year}-${data.monthIndex}`}
                className="flex-1 text-center text-[11px] sm:text-xs text-stone-500 dark:text-stone-400 font-medium"
              >
                {data.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

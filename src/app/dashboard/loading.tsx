export default function DashboardLoading() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header Skeleton */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#181512]/80 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between transition-colors">
        <div className="space-y-1.5 animate-pulse">
          <div className="h-6 sm:h-7 w-36 sm:w-48 bg-muted/70 rounded-lg" />
          <div className="h-3 sm:h-3.5 w-48 sm:w-64 bg-muted/50 rounded-full" />
        </div>
        <div className="flex items-center gap-3 animate-pulse">
          <div className="size-9 rounded-full bg-muted/60" />
        </div>
      </header>

      {/* Main Content Area Skeleton */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-5 sm:gap-6 max-w-7xl w-full mx-auto animate-pulse pt-6">
        {/* Welcome Banner Skeleton */}
        <div className="w-full h-24 sm:h-28 bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 shadow-xs flex items-center gap-4">
          <div className="size-12 rounded-2xl bg-muted/60 shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-5 w-48 bg-muted/70 rounded-full" />
            <div className="h-3.5 w-64 bg-muted/40 rounded-full" />
          </div>
        </div>

        {/* 4 Stat Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 shadow-xs flex items-center gap-4"
            >
              <div className="size-12 rounded-2xl bg-muted/60 shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-3.5 w-20 bg-muted/50 rounded-full" />
                <div className="h-6 w-14 bg-muted/80 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* 2 Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 shadow-xs h-72 flex flex-col justify-between">
            <div className="h-4 w-32 bg-muted/60 rounded-full" />
            <div className="size-36 mx-auto rounded-full border-8 border-muted/50" />
            <div className="h-3 w-48 mx-auto bg-muted/40 rounded-full" />
          </div>
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 shadow-xs h-72 flex flex-col justify-between">
            <div className="h-4 w-36 bg-muted/60 rounded-full" />
            <div className="flex items-end justify-between h-40 px-4 gap-2">
              {[40, 65, 30, 85, 55, 70].map((h, idx) => (
                <div
                  key={idx}
                  className="w-8 bg-muted/50 rounded-t-lg"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <div className="h-3 w-48 mx-auto bg-muted/40 rounded-full" />
          </div>
        </div>

        {/* Table / List Skeleton */}
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="h-4 w-36 bg-muted/60 rounded-full" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 rounded-2xl bg-muted/20 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted/60 shrink-0" />
                  <div className="space-y-1.5">
                    <div className="h-3.5 w-32 bg-muted/60 rounded-full" />
                    <div className="h-2.5 w-24 bg-muted/40 rounded-full" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-muted/50 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

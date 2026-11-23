export default function AdminReviewsLoading() {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-[#181512]/80 backdrop-blur-md border-b border-stone-200/70 dark:border-stone-800 px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4 flex items-center justify-between transition-colors">
        <div className="space-y-1.5 animate-pulse">
          <div className="h-6 sm:h-7 w-48 bg-muted/70 rounded-lg" />
          <div className="h-3 sm:h-3.5 w-64 bg-muted/50 rounded-full" />
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6 pt-6 animate-pulse">
        <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-stone-800">
            <div className="space-y-1.5">
              <div className="h-5 w-44 bg-muted/70 rounded-lg" />
              <div className="h-3 w-32 bg-muted/50 rounded-full" />
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-48 bg-muted/50 rounded-full" />
              <div className="h-8 w-28 bg-muted/50 rounded-full" />
            </div>
          </div>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-muted/60" />
                  <div className="space-y-1.5">
                    <div className="w-32 h-3.5 bg-muted/60 rounded" />
                    <div className="w-48 h-3 bg-muted/40 rounded" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-16 h-6 bg-muted/50 rounded-full" />
                  <div className="w-16 h-6 bg-muted/50 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

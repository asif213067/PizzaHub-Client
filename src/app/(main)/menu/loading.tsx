import { PizzaCardSkeleton } from "@/components/shared/pizza-card";

export default function MenuLoading() {
  return (
    <main className="w-full flex-1 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Skeleton */}
        <div className="space-y-2 animate-pulse">
          <div className="h-8 sm:h-9 w-48 sm:w-56 bg-muted rounded-full" />
          <div className="h-4 w-72 sm:w-96 bg-muted/60 rounded-full" />
        </div>

        {/* Filter Bar Skeleton */}
        <div className="bg-card border border-border/80 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4 animate-pulse">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input Skeleton */}
            <div className="flex-1 h-11 bg-muted/60 rounded-full" />
            {/* Location & Sort Skeletons */}
            <div className="flex gap-2">
              <div className="w-32 sm:w-36 h-11 bg-muted/60 rounded-full" />
              <div className="w-32 sm:w-36 h-11 bg-muted/60 rounded-full" />
            </div>
          </div>

          {/* Category Pills Skeleton */}
          <div className="flex items-center gap-2 overflow-hidden pt-1">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-8 w-24 sm:w-28 bg-muted/60 rounded-full shrink-0"
              />
            ))}
          </div>
        </div>

        {/* 9-Card Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
          {Array.from({ length: 9 }).map((_, i) => (
            <PizzaCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </main>
  );
}

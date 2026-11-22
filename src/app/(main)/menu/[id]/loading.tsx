export default function MenuItemDetailsLoading() {
  return (
    <main className="w-full flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-20 bg-muted/70 rounded-full" />
          <div className="h-3 w-3 bg-muted/40 rounded" />
          <div className="h-3.5 w-24 bg-muted/70 rounded-full" />
          <div className="h-3 w-3 bg-muted/40 rounded" />
          <div className="h-3.5 w-32 bg-muted/50 rounded-full" />
        </div>

        {/* Main 2-Column Product Detail Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Skeleton */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full max-w-md aspect-square bg-muted/70 rounded-3xl border border-border/60 shadow-sm" />
            {/* Thumbnails */}
            <div className="flex gap-3 mt-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="size-16 rounded-2xl bg-muted/60 border border-border/50"
                />
              ))}
            </div>
          </div>

          {/* Right Column: Details Skeleton */}
          <div className="lg:col-span-6 space-y-5">
            {/* Category Badge */}
            <div className="h-6 w-24 bg-muted/70 rounded-full" />

            {/* Title */}
            <div className="h-8 sm:h-9 w-4/5 bg-muted rounded-2xl" />

            {/* Rating & Reviews */}
            <div className="flex items-center gap-3">
              <div className="h-5 w-32 bg-muted/60 rounded-full" />
              <div className="h-4 w-20 bg-muted/40 rounded-full" />
            </div>

            {/* Price */}
            <div className="h-9 w-28 bg-muted rounded-xl" />

            {/* Description lines */}
            <div className="space-y-2 pt-2">
              <div className="h-3.5 w-full bg-muted/60 rounded-full" />
              <div className="h-3.5 w-5/6 bg-muted/60 rounded-full" />
              <div className="h-3.5 w-2/3 bg-muted/50 rounded-full" />
            </div>

            {/* Vendor Card Skeleton */}
            <div className="bg-card border border-border/70 rounded-2xl p-4 flex items-center gap-3.5 mt-4">
              <div className="size-12 rounded-xl bg-muted/70 shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-36 bg-muted/70 rounded-full" />
                <div className="h-3 w-24 bg-muted/50 rounded-full" />
              </div>
            </div>

            {/* Order Action Button Skeleton */}
            <div className="pt-4">
              <div className="h-12 w-full sm:w-56 bg-muted/80 rounded-full" />
            </div>
          </div>
        </div>

        {/* Customer Reviews Section Skeleton */}
        <div className="bg-stone-50 dark:bg-card border border-stone-200/80 dark:border-stone-800 rounded-3xl p-6 sm:p-8 mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1.5">
              <div className="h-6 w-44 bg-muted/70 rounded-lg" />
              <div className="h-3.5 w-28 bg-muted/50 rounded-full" />
            </div>
            <div className="h-4 w-24 bg-muted/40 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white dark:bg-stone-900 border border-border/60 rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center gap-2.5">
                  <div className="size-9 rounded-full bg-muted/70 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-20 bg-muted/70 rounded-full" />
                    <div className="h-2.5 w-14 bg-muted/40 rounded-full" />
                  </div>
                </div>
                <div className="h-3 w-20 bg-muted/50 rounded-full" />
                <div className="h-3 w-full bg-muted/40 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

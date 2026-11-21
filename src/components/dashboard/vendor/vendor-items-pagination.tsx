"use client";

interface VendorItemsPaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

export function VendorItemsPagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  itemLabel = "items",
}: VendorItemsPaginationProps) {
  if (totalItems === 0) return null;

  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pages: number[] = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 select-none">
      {/* Left count indicator */}
      <p className="text-xs text-muted-foreground font-medium">
        Showing {start} to {end} of {totalItems} {itemLabel}
      </p>

      {/* Right controls */}
      {totalPages > 1 && (
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Previous */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            &lt; Previous
          </button>

          {/* Page numbers */}
          {pages.map((p) => {
            const isActive = p === currentPage;
            return (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`size-8 sm:size-9 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                  isActive
                    ? "bg-[#c22d2f] text-white shadow-xs"
                    : "bg-white dark:bg-card border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:border-primary/50"
                }`}
              >
                {p}
              </button>
            );
          })}

          {/* Next */}
          <button
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="px-3 py-1.5 rounded-full text-xs font-semibold text-muted-foreground hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next &gt;
          </button>
        </div>
      )}
    </div>
  );
}

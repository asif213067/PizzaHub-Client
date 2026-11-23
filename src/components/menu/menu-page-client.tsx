"use client";

import { useState, useCallback, useRef, useTransition } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MenuFilters, MenuFiltersState, SortOption } from "./menu-filters";
import { MenuGrid } from "./menu-grid";
import { MenuItem } from "@/components/shared/pizza-card";
import { menuService } from "@/services/menu.service";

interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const ITEMS_PER_PAGE = 9;
const DEBOUNCE_MS = 400;

const DEFAULT_FILTERS: MenuFiltersState = {
  search: "",
  category: "",
  location: "",
  sort: "",
};

const EMPTY_PAGINATION: Pagination = {
  total: 0,
  page: 1,
  limit: ITEMS_PER_PAGE,
  totalPages: 1,
};

export function MenuPageClient() {
  const [filters, setFilters] = useState<MenuFiltersState>(DEFAULT_FILTERS);
  const [currentPage, setCurrentPage] = useState(1);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [pagination, setPagination] = useState<Pagination>(EMPTY_PAGINATION);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  // Debounce search with a ref-based timer — does NOT call setState in an effect
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestFiltersRef = useRef(filters);
  latestFiltersRef.current = filters;

  // Core fetch — does NOT use useEffect; called imperatively from handlers
  const fetchItems = useCallback(
    async (nextFilters: MenuFiltersState, nextPage: number) => {
      setLoading(true);
      setError(null);

      try {
        const json = await menuService.getPublicItems({
          search: nextFilters.search,
          category: nextFilters.category,
          location: nextFilters.location,
          sort: nextFilters.sort,
          page: nextPage,
          limit: ITEMS_PER_PAGE,
        });

        if (json.success && Array.isArray(json.data)) {
          const itemsList = json.data as unknown as MenuItem[];
          startTransition(() => {
            setItems(itemsList);
            setPagination(
              json.pagination ?? {
                total: json.data.length,
                page: nextPage,
                limit: ITEMS_PER_PAGE,
                totalPages: 1,
              }
            );
            setLocations((prev) => {
              const all = new Set([
                ...prev,
                ...itemsList
                  .map((it) => it.location)
                  .filter((loc): loc is string => Boolean(loc)),
              ]);
              return Array.from(all).sort();
            });
          });
        } else {
          startTransition(() => {
            setItems([]);
            setPagination(EMPTY_PAGINATION);
          });
        }
      } catch (err) {
        startTransition(() => {
          setError(
            err instanceof Error ? err.message : "Failed to load menu items."
          );
        });
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Initial load on mount only — using a ref guard so it only fires once
  const didMountRef = useRef(false);
  if (!didMountRef.current) {
    didMountRef.current = true;
    // Fire async on first render (safe — no setState in a synchronous effect body)
    setTimeout(() => fetchItems(DEFAULT_FILTERS, 1), 0);
  }

  // ---- Helpers ----
  function applyFilters(next: MenuFiltersState, page = 1) {
    setCurrentPage(page);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    fetchItems(next, page);
  }

  function applyFiltersDebounced(next: MenuFiltersState) {
    setCurrentPage(1);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      fetchItems(next, 1);
    }, DEBOUNCE_MS);
  }

  // ---- Filter handlers ----
  function handleSearchChange(val: string) {
    const next = { ...latestFiltersRef.current, search: val };
    setFilters(next);
    applyFiltersDebounced(next);
  }

  function handleCategoryChange(val: string) {
    const next = { ...latestFiltersRef.current, category: val };
    setFilters(next);
    applyFilters(next);
  }

  function handleLocationChange(val: string) {
    const next = { ...latestFiltersRef.current, location: val };
    setFilters(next);
    applyFilters(next);
  }

  function handleSortChange(val: SortOption) {
    const next = { ...latestFiltersRef.current, sort: val };
    setFilters(next);
    applyFilters(next);
  }

  function handleClearAll() {
    setFilters(DEFAULT_FILTERS);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    setCurrentPage(1);
    fetchItems(DEFAULT_FILTERS, 1);
  }

  // ---- Pagination ----
  function goToPage(page: number) {
    if (page < 1 || page > pagination.totalPages) return;
    setCurrentPage(page);
    fetchItems(latestFiltersRef.current, page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageNumbers = buildPageNumbers(currentPage, pagination.totalPages);

  return (
    <main className="w-full flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        {/* Page Header */}
        <div className="mb-8">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-primary bg-primary/10 border border-primary/20 px-3 py-1 rounded-full mb-3">
            Browse Menu
          </span>
          <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight">
            Find your next favorite pizza
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Search approved, active items from local pizza shops.
          </p>
          <p className="text-xs text-muted-foreground/70 mt-0.5">
            You can browse freely. Sign in to view details and order.
          </p>
        </div>

        {/* Filters */}
        <MenuFilters
          filters={filters}
          locations={locations}
          totalCount={pagination.total}
          loading={loading}
          onSearchChange={handleSearchChange}
          onCategoryChange={handleCategoryChange}
          onLocationChange={handleLocationChange}
          onSortChange={handleSortChange}
          onClearAll={handleClearAll}
        />

        {/* Grid */}
        <MenuGrid
          items={items}
          loading={loading}
          error={error}
          onRetry={() => fetchItems(filters, currentPage)}
        />

        {/* Pagination */}
        {!loading && !error && pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-14 flex-wrap">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="Previous page"
              className="size-9 flex items-center justify-center rounded-full border border-border/70 bg-white dark:bg-[#28241E] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="size-4" />
            </button>

            {pageNumbers.map((p, i) =>
              p === "..." ? (
                <span
                  key={`ellipsis-${i}`}
                  className="size-9 flex items-center justify-center text-xs text-muted-foreground"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  type="button"
                  onClick={() => goToPage(Number(p))}
                  aria-label={`Page ${p}`}
                  aria-current={currentPage === p ? "page" : undefined}
                  className={[
                    "size-9 flex items-center justify-center rounded-full border text-xs font-semibold transition-all cursor-pointer",
                    currentPage === p
                      ? "bg-primary text-white border-primary shadow-sm"
                      : "bg-white dark:bg-[#28241E] text-foreground border-border/70 hover:border-primary/50 hover:text-primary",
                  ].join(" ")}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              aria-label="Next page"
              className="size-9 flex items-center justify-center rounded-full border border-border/70 bg-white dark:bg-[#28241E] text-foreground hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronRight className="size-4" />
            </button>

            <span className="ml-2 text-xs text-muted-foreground">
              Page {currentPage} of {pagination.totalPages}
            </span>
          </div>
        )}
      </div>
    </main>
  );
}

// Build visible page numbers with ellipsis
function buildPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "...")[] = [];
  pages.push(1);
  if (current > 3) pages.push("...");
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let i = start; i <= end; i++) pages.push(i);
  if (current < total - 2) pages.push("...");
  pages.push(total);
  return pages;
}

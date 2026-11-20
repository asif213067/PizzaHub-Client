"use client";

import { useCallback } from "react";
import { Search, ChevronDown, X } from "lucide-react";

export type SortOption = "" | "price-asc" | "price-desc";

export interface MenuFiltersState {
  search: string;
  category: string;
  location: string;
  sort: SortOption;
}

interface MenuFiltersProps {
  filters: MenuFiltersState;
  locations: string[];
  totalCount: number;
  loading: boolean;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: SortOption) => void;
  onClearAll: () => void;
}

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Classic Pizzas", value: "Classic Pizzas" },
  { label: "Vegetarian Pizzas", value: "Vegetarian Pizzas" },
  { label: "Meat Lovers", value: "Meat Lovers" },
  { label: "Gourmet Pizzas", value: "Gourmet Pizzas" },
  { label: "Sides & Appetizers", value: "Sides & Appetizers" },
  { label: "Beverages & Desserts", value: "Beverages & Desserts" },
];

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: "Sort: Default", value: "" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export function MenuFilters({
  filters,
  locations,
  totalCount,
  loading,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortChange,
  onClearAll,
}: MenuFiltersProps) {
  const hasActiveFilters =
    !!filters.search || !!filters.category || !!filters.location || !!filters.sort;

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
    },
    []
  );

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Search bar */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-3 bg-white dark:bg-[#28241E] border border-border/70 rounded-full px-4 py-2 shadow-xs focus-within:border-primary/50 transition-all"
      >
        <Search className="size-4 text-muted-foreground shrink-0" />
        <input
          type="text"
          placeholder="Search pizza, sides, drinks by name"
          value={filters.search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none min-w-0"
        />
        {filters.search && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="p-0.5 rounded-full text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
        <button
          type="submit"
          className="shrink-0 bg-[image:var(--gradient-primary)] hover:brightness-105 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-sm transition-all cursor-pointer"
        >
          Search
        </button>
      </form>

      {/* Location + Sort row */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Location Dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.location}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full appearance-none bg-white dark:bg-[#28241E] border border-border/70 rounded-full px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-primary/50 transition-all cursor-pointer shadow-xs"
          >
            <option value="">All locations</option>
            {locations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-1">
          <select
            value={filters.sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full appearance-none bg-white dark:bg-[#28241E] border border-border/70 rounded-full px-4 py-2.5 pr-9 text-sm text-foreground outline-none focus:border-primary/50 transition-all cursor-pointer shadow-xs"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-col gap-2">
        <h3 className="font-heading font-bold text-base sm:text-lg text-foreground">
          Pizza Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const isActive = filters.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onCategoryChange(cat.value)}
                className={[
                  "text-xs sm:text-sm font-medium px-4 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap",
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white dark:bg-[#28241E] text-foreground border-border/70 hover:border-primary/50 hover:bg-muted/60",
                ].join(" ")}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results summary + clear */}
      <div className="flex items-center justify-between gap-2 min-h-[22px]">
        <p className="text-xs sm:text-sm text-muted-foreground">
          {loading ? (
            <span className="inline-block w-32 h-3.5 bg-muted rounded-full animate-pulse" />
          ) : (
            <span>
              <span className="font-semibold text-foreground">{totalCount}</span>{" "}
              item{totalCount !== 1 ? "s" : ""} found
            </span>
          )}
        </p>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
          >
            <X className="size-3" />
            Clear filters
          </button>
        )}
      </div>
    </div>
  );
}

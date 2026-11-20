"use client";

import { Pizza } from "lucide-react";
import { PizzaCard, PizzaCardSkeleton, MenuItem } from "@/components/shared/pizza-card";

interface MenuGridProps {
  items: MenuItem[];
  loading: boolean;
  error: string | null;
  onRetry: () => void;
}

const SKELETON_COUNT = 9;

export function MenuGrid({ items, loading, error, onRetry }: MenuGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <PizzaCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
          <Pizza className="size-8 text-destructive/60" />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          Could not load menu items
        </h3>
        <p className="text-sm text-muted-foreground mb-5 max-w-sm">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="text-sm font-semibold px-5 py-2.5 rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer"
        >
          Try again
        </button>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="size-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Pizza className="size-8 text-muted-foreground/60" />
        </div>
        <h3 className="font-heading font-bold text-lg text-foreground mb-1">
          No pizzas found
        </h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          Try adjusting your search term, category, or location filter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
      {items.map((item, index) => (
        <PizzaCard key={item._id} item={item} index={index} />
      ))}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { PizzaCard, PizzaCardSkeleton, MenuItem } from "@/components/shared/pizza-card";

interface RelatedVendorItemsProps {
  itemId: string;
  vendorName: string;
}

export function RelatedVendorItems({
  itemId,
  vendorName,
}: RelatedVendorItemsProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const serverUrl =
      process.env.NEXT_PUBLIC_SERVER_BASE_URL || "http://localhost:5000";

    async function loadRelated() {
      try {
        const res = await fetch(`${serverUrl}/api/menu/${itemId}/related?limit=3`, {
          cache: "no-store",
        });

        if (!res.ok) {
          if (isMounted) setItems([]);
          return;
        }

        const json = await res.json();
        if (isMounted) {
          if (json.success && Array.isArray(json.data)) {
            setItems(json.data);
          } else {
            setItems([]);
          }
        }
      } catch {
        if (isMounted) setItems([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadRelated();

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  // While loading, show skeleton
  if (loading) {
    return (
      <section className="w-full mt-16 sm:mt-24 pt-10 border-t border-border/60">
        <div className="flex flex-col gap-2 mb-6 sm:mb-8">
          <div className="h-7 w-64 bg-muted/80 rounded-full animate-pulse" />
          <div className="h-4 w-40 bg-muted/60 rounded-full animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
          {Array.from({ length: 3 }).map((_, idx) => (
            <PizzaCardSkeleton key={idx} />
          ))}
        </div>
      </section>
    );
  }

  // If no related items exist, completely hide the section
  if (items.length === 0) {
    return null;
  }

  return (
    <section className="w-full mt-16 sm:mt-24 pt-10 border-t border-border/60">
      <div className="mb-4 sm:mb-6">
        <h2 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          More from {vendorName}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Other approved specialties freshly made by this pizzeria
        </p>
      </div>

      <div
        className={[
          "grid gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20",
          items.length === 1
            ? "grid-cols-1 max-w-sm mx-auto md:mx-0"
            : items.length === 2
            ? "grid-cols-1 md:grid-cols-2 max-w-2xl"
            : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        ].join(" ")}
      >
        {items.map((relatedItem, index) => (
          <PizzaCard key={relatedItem._id} item={relatedItem} index={index} />
        ))}
      </div>
    </section>
  );
}

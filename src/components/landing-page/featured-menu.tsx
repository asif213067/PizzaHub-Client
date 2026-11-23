"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Pizza } from "lucide-react";
import { PizzaCard, PizzaCardSkeleton, MenuItem } from "@/components/shared/pizza-card";
import { useFeaturedMenu } from "@/hooks/queries";

export function FeaturedMenu() {
  const { data: menuData, isLoading: loading, error: queryError } = useFeaturedMenu(6);

  const items = (menuData?.data || []) as unknown as MenuItem[];
  const error = queryError ? (queryError instanceof Error ? queryError.message : "Failed to load featured items") : null;

  return (
    <section className="w-full py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Heading & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-left mb-4 sm:mb-6"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
            Featured Menu Items
          </h2>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Discover our handpicked selection of freshly made pizzas from trusted local vendors. Explore delicious flavors, quality ingredients, and customer favorites—all in one place.
          </p>
        </motion.div>

        {/* Content Grid: Exactly 3 cards per line on desktop */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
            {Array.from({ length: 6 }).map((_, idx) => (
              <PizzaCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="bg-card border border-border/80 rounded-3xl p-8 text-center my-6">
            <Pizza className="size-10 text-muted-foreground mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-card-foreground">
              Could not load featured pizzas
            </p>
            <p className="text-xs text-muted-foreground mt-1 mb-4">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs font-semibold px-4 py-2 rounded-full bg-primary text-white hover:opacity-90 transition cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="bg-card border border-border/80 rounded-3xl p-10 text-center my-6">
            <Pizza className="size-12 text-primary/40 mx-auto mb-3" />
            <h3 className="text-base font-bold text-card-foreground">
              No featured pizzas available right now
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Check back soon or explore our full menu.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-20 gap-x-6 lg:gap-x-8 pt-16 sm:pt-20">
            {items.map((item, index) => (
              <PizzaCard key={item._id} item={item} index={index} />
            ))}
          </div>
        )}

        {/* Explore All CTA at bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="flex justify-center mt-12 sm:mt-16"
        >
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border hover:border-primary/50 bg-card hover:bg-muted text-card-foreground font-semibold text-sm shadow-xs transition-all group"
          >
            <span>Explore Full Menu</span>
            <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

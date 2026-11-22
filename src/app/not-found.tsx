import Link from "next/link";
import { Metadata } from "next";
import { Pizza, Home, UtensilsCrossed, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "404 - Page Not Found | PizzaHub",
  description: "Oops! We could not find the slice or page you were looking for.",
};

const POPULAR_CATEGORIES = [
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Gourmet Pizzas",
];

export default function NotFound() {
  return (
    <main className="flex-1 flex items-center justify-center py-12 sm:py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full mx-auto text-center flex flex-col items-center">
        {/* Pizza-themed 404 Illustration / Graphic */}
        <div className="relative mb-6 sm:mb-8">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-primary/15 dark:bg-primary/20 blur-3xl rounded-full -z-10 scale-125" />

          {/* Central Badge */}
          <div className="relative size-28 sm:size-36 rounded-full bg-radial from-amber-100 to-amber-200/80 dark:from-stone-800 dark:to-stone-900 border-4 border-white dark:border-stone-800 shadow-xl flex items-center justify-center">
            <Pizza className="size-14 sm:size-18 text-primary drop-shadow-md animate-pulse" />
            {/* Floating Sparkle / Slice Badge */}
            <span className="absolute -top-1 -right-1 size-7 sm:size-8 rounded-full bg-primary text-white flex items-center justify-center shadow-md">
              <Sparkles className="size-4" />
            </span>
          </div>
        </div>

        {/* 404 Big Label */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-wider uppercase mb-3">
          <span>Error 404</span>
        </div>

        {/* Heading */}
        <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground">
          Oops! Slice Not Found
        </h1>

        {/* Subtitle / Description */}
        <p className="text-sm sm:text-base text-muted-foreground mt-3 max-w-md mx-auto leading-relaxed">
          We searched every corner of our kitchen, but this page has either been devoured, moved to a new address, or never existed.
        </p>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 w-full sm:w-auto">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-sm px-6 py-3 rounded-full shadow-md transition-all cursor-pointer"
          >
            <Home className="size-4" />
            <span>Back to Homepage</span>
          </Link>

          <Link
            href="/menu"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-card hover:bg-muted border border-border hover:border-primary/50 text-foreground font-semibold text-sm px-6 py-3 rounded-full shadow-xs transition-all cursor-pointer"
          >
            <UtensilsCrossed className="size-4 text-primary" />
            <span>Browse Full Menu</span>
          </Link>
        </div>

        {/* Quick Categories Section */}
        <div className="mt-12 pt-8 border-t border-border/60 w-full max-w-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Looking for something delicious?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {POPULAR_CATEGORIES.map((cat) => (
              <Link
                key={cat}
                href={`/menu?category=${encodeURIComponent(cat)}`}
                className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/60 transition-colors"
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

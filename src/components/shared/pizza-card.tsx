"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

export interface MenuItem {
  _id: string;
  itemName: string;
  category: string;
  description?: string;
  price: number;
  location: string;
  images: string[];
  status: string;
  vendor?: {
    _id?: string;
    name?: string;
    businessName?: string;
    image?: string;
    subscriptionPlan?: string;
  };
}

interface PizzaCardProps {
  item: MenuItem;
  index?: number;
}

export function PizzaCard({ item, index = 0 }: PizzaCardProps) {
  const imageUrl =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80";

  const vendorDisplayName =
    item.vendor?.businessName || item.vendor?.name || "Local Pizzeria";

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.45, delay: (index % 3) * 0.12 }}
      className="relative bg-white dark:bg-[#28241E] rounded-[28px] sm:rounded-[32px] pt-18 sm:pt-20 pb-5 sm:pb-6 px-5 sm:px-6 shadow-sm hover:shadow-xl transition-all duration-300 border border-border/70 flex flex-col justify-between items-center text-center group"
    >
      {/* Floating Circular Pizza Image */}
      <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 size-28 sm:size-32 rounded-full overflow-hidden border-4 border-white dark:border-[#28241E] shadow-lg group-hover:scale-105 transition-transform duration-300 bg-muted/60">
        <Image
          src={imageUrl}
          alt={item.itemName}
          fill
          sizes="(max-width: 640px) 112px, 128px"
          className="object-cover rounded-full"
        />
      </div>

      {/* Card Info */}
      <div className="w-full flex flex-col items-center">
        {/* Item Name */}
        <h3
          className="font-heading font-bold text-lg sm:text-xl text-card-foreground line-clamp-1 w-full"
          title={item.itemName}
        >
          {item.itemName}
        </h3>

        {/* Category & Location */}
        <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-1 line-clamp-1">
          {item.category} · {item.location}
        </p>

        {/* Vendor Info */}
        <p className="text-[11px] sm:text-xs text-muted-foreground/80 mt-0.5 line-clamp-1">
          by {vendorDisplayName}
        </p>
      </div>

      {/* Bottom Row: Price & View Details CTA */}
      <div className="w-full flex items-center justify-between mt-5 pt-3 border-t border-border/50">
        <span className="font-heading font-extrabold text-lg sm:text-xl text-primary">
          ${item.price.toFixed(2)}
        </span>

        <Link
          href={`/menu/${item._id}`}
          className="bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2 sm:py-2.5 rounded-full shadow-md transition-all cursor-pointer"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

export function PizzaCardSkeleton() {
  return (
    <div className="relative bg-white dark:bg-[#28241E] rounded-[28px] sm:rounded-[32px] pt-18 sm:pt-20 pb-5 sm:pb-6 px-5 sm:px-6 shadow-xs border border-border/60 flex flex-col justify-between items-center animate-pulse">
      {/* Top Floating Circle Skeleton */}
      <div className="absolute -top-14 sm:-top-16 left-1/2 -translate-x-1/2 size-28 sm:size-32 rounded-full bg-muted border-4 border-white dark:border-[#28241E]" />

      <div className="w-full flex flex-col items-center gap-2">
        <div className="h-5 w-3/4 bg-muted rounded-full" />
        <div className="h-3.5 w-1/2 bg-muted/70 rounded-full" />
        <div className="h-3 w-1/3 bg-muted/60 rounded-full" />
      </div>

      <div className="w-full flex items-center justify-between mt-5 pt-3 border-t border-border/40">
        <div className="h-6 w-14 bg-muted rounded-full" />
        <div className="h-8 w-24 bg-muted rounded-full" />
      </div>
    </div>
  );
}

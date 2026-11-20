"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  ChevronLeft,
  MapPin,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { MenuItem } from "@/components/shared/pizza-card";
import { RelatedVendorItems } from "./related-vendor-items";
import { OrderModal } from "./order-modal";
import { useSession } from "@/lib/auth-client";

interface ItemDetailsClientProps {
  item: MenuItem;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=800&q=80";

export function ItemDetailsClient({ item }: ItemDetailsClientProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const images =
    item.images && item.images.length > 0 ? item.images : [FALLBACK_IMAGE];

  const vendorDisplayName =
    item.vendor?.businessName || item.vendor?.name || "Local Pizzeria";

  const vendorLocation = item.location || "City Center";
  const isPremium = item.vendor?.subscriptionPlan === "premium";
  const vendorInitial = vendorDisplayName.charAt(0).toUpperCase() || "V";

  function handlePrevImage() {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }

  function handleNextImage() {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }

  function handleOrderClick() {
    if (!session?.user) {
      router.push(`/auth/signin?callbackUrl=/menu/${item._id}`);
      return;
    }

    const user = session.user as { id?: string; role?: string };
    const role = user.role || "customer";

    // 1. Role-based restriction: Only customers can place orders
    if (role !== "customer") {
      toast.error("Only customers can place orders.");
      return;
    }

    // 2. Prevent vendors from ordering their own products
    const vendorId = item.vendor?._id;
    if (vendorId && user.id && vendorId.toString() === user.id.toString()) {
      toast.error("You cannot place an order for your own menu item.");
      return;
    }

    // Open the order dialog
    setOrderModalOpen(true);
  }

  return (
    <main className="w-full flex-1 py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 sm:gap-2 text-xs text-muted-foreground mb-5 sm:mb-6 flex-wrap"
        >
          <Link
            href="/menu"
            className="hover:text-foreground transition-colors font-medium"
          >
            Browse Menu
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
          <Link
            href={`/menu?category=${encodeURIComponent(item.category)}`}
            className="hover:text-foreground transition-colors font-medium"
          >
            {item.category}
          </Link>
          <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
          <span className="text-foreground font-semibold truncate max-w-[220px] sm:max-w-none">
            {item.itemName}
          </span>
        </nav>

        {/* 2-Column Product Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column: Clean Rectangular Image Gallery (No borders/frames) */}
          <div className="lg:col-span-7 flex flex-col items-center w-full">
            <div className="relative aspect-[16/10] w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-muted/20 shadow-md group">
              {/* Product Image: consistent dimensions, no distortion */}
              <Image
                src={images[activeImageIndex]}
                alt={item.itemName}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 58vw, 680px"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
              />

              {/* Prev / Next Controls (if multiple images exist) */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    aria-label="Previous image"
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-md shadow-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <button
                    type="button"
                    onClick={handleNextImage}
                    aria-label="Next image"
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 size-9 sm:size-10 rounded-full bg-black/45 hover:bg-black/65 text-white backdrop-blur-md shadow-lg transition-all flex items-center justify-center cursor-pointer active:scale-95"
                  >
                    <ChevronRight className="size-5" />
                  </button>

                  {/* Image Counter Badge */}
                  <span className="absolute bottom-3 right-3 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-black/55 text-white backdrop-blur-md tracking-wider">
                    {activeImageIndex + 1} / {images.length}
                  </span>
                </>
              )}
            </div>

            {/* Dot Indicators */}
            {images.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-3.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveImageIndex(idx)}
                    aria-label={`Jump to image ${idx + 1}`}
                    className={[
                      "transition-all duration-200 cursor-pointer rounded-full",
                      activeImageIndex === idx
                        ? "w-6 h-2 bg-primary"
                        : "size-2 bg-border hover:bg-muted-foreground/50",
                    ].join(" ")}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Refined Typography & Details */}
          <div className="lg:col-span-5 flex flex-col items-start text-left w-full">
            {/* Category Tag */}
            <span className="inline-block text-xs font-semibold px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 mb-2.5">
              {item.category}
            </span>

            {/* Pizza Name: Balanced size with strong hierarchy */}
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-snug">
              {item.itemName}
            </h1>

            {/* Price & Status Badges */}
            <div className="flex items-center gap-3 mt-2.5 flex-wrap">
              <span className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
                ${item.price.toFixed(2)}
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-muted/60 dark:bg-muted border border-border/70 text-foreground">
                <MapPin className="size-3 text-primary shrink-0" />
                <span>{item.location}</span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 className="size-3 shrink-0" />
                <span>Available</span>
              </span>
            </div>

            {/* Description */}
            <div className="mt-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
              <p>
                {item.description ||
                  "Hand-stretched dough topped with slow-simmered tomato sauce, creamy mozzarella, and fresh basil, baked until the crust turns golden and bubbly. A simple, classic flavor that works any time of day."}
              </p>
            </div>

            {/* Ingredients Note */}
            <div className="mt-4 w-full p-3 rounded-2xl bg-muted/40 dark:bg-muted/20 border border-border/60 text-xs sm:text-sm text-muted-foreground flex items-center gap-2">
              <span className="font-semibold text-foreground shrink-0">Ingredients:</span>
              <span className="truncate sm:whitespace-normal">
                pizza dough, tomato sauce, mozzarella, basil, olive oil.
              </span>
            </div>

            {/* Vendor Profile Card */}
            <div className="w-full mt-5 p-3.5 rounded-2xl bg-card border border-border/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                {/* Vendor Avatar */}
                <div className="size-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  {item.vendor?.image ? (
                    <Image
                      src={item.vendor.image}
                      alt={vendorDisplayName}
                      width={40}
                      height={40}
                      className="size-full rounded-full object-cover"
                    />
                  ) : (
                    <span>{vendorInitial}</span>
                  )}
                </div>

                {/* Vendor Name & Area */}
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground truncate">
                    {vendorDisplayName}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {vendorLocation}
                  </p>
                </div>
              </div>

              {/* Subscription Badge */}
              {isPremium ? (
                <span className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                  <Sparkles className="size-3 text-amber-500" />
                  <span>Premium</span>
                </span>
              ) : (
                <span className="shrink-0 text-[11px] font-medium px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border">
                  Vendor
                </span>
              )}
            </div>

            {/* Order Now Button (Kept visible, ordering logic reserved for later) */}
            <button
              type="button"
              onClick={handleOrderClick}
              className="w-full sm:w-auto min-w-[200px] mt-6 bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-sm sm:text-base px-8 py-3 rounded-full shadow-md transition-all cursor-pointer text-center"
            >
              Order Now
            </button>
          </div>
        </div>

        {/* Dynamic "More from [Vendor Name]" Section */}
        <RelatedVendorItems
          itemId={item._id}
          vendorName={vendorDisplayName}
        />

        {/* Place Your Order Dialog */}
        <OrderModal
          item={item}
          isOpen={orderModalOpen}
          onClose={() => setOrderModalOpen(false)}
        />
      </div>
    </main>
  );
}

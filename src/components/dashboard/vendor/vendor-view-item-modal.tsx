"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  X,
  MapPin,
  Tag,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { VendorMenuItem } from "@/types/vendor";

interface VendorViewItemModalProps {
  item: VendorMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80";

export function VendorViewItemModal({
  item,
  isOpen,
  onClose,
}: VendorViewItemModalProps) {
  if (!isOpen || !item) return null;

  return (
    <VendorViewItemContent
      key={item._id}
      item={item}
      onClose={onClose}
    />
  );
}

function VendorViewItemContent({
  item,
  onClose,
}: {
  item: VendorMenuItem;
  onClose: () => void;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const rawImages =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images.filter(Boolean)
      : typeof (item as unknown as { image?: string }).image === "string" &&
        (item as unknown as { image?: string }).image
      ? [(item as unknown as { image?: string }).image!]
      : [];

  const images = rawImages.length > 0 ? rawImages : [FALLBACK_IMAGE];
  const hasMultipleImages = images.length > 1;

  const handlePrevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      } else if (hasMultipleImages) {
        if (e.key === "ArrowLeft") {
          setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
        } else if (e.key === "ArrowRight") {
          setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hasMultipleImages, images.length, onClose]);

  function formatDate(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="view-item-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer z-20"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-7">
          <h2
            id="view-item-modal-title"
            className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
          >
            {item.itemName}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Category: {item.category}
          </p>
        </div>

        {/* Image Slider / Carousel */}
        <div className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 border border-border/70 mb-4 group select-none">
          <Image
            src={images[activeImageIndex]}
            alt={`${item.itemName} - Photo ${activeImageIndex + 1}`}
            fill
            className="object-cover transition-all duration-300"
            sizes="(max-width: 640px) 100vw, 512px"
            priority
          />

          {hasMultipleImages && (
            <>
              {/* Previous Image Button */}
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 size-8 sm:size-9 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95 z-10"
              >
                <ChevronLeft className="size-4 sm:size-5" />
              </button>

              {/* Next Image Button */}
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 size-8 sm:size-9 rounded-full bg-black/50 hover:bg-black/75 text-white backdrop-blur-xs shadow-md transition-all flex items-center justify-center cursor-pointer active:scale-95 z-10"
              >
                <ChevronRight className="size-4 sm:size-5" />
              </button>

              {/* Image Counter Badge */}
              <span className="absolute bottom-2.5 right-2.5 text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full bg-black/60 text-white backdrop-blur-xs tracking-wider z-10">
                {activeImageIndex + 1} / {images.length}
              </span>

              {/* Dot Indicators */}
              <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveImageIndex(idx);
                    }}
                    aria-label={`Jump to image ${idx + 1}`}
                    className={[
                      "transition-all duration-200 cursor-pointer rounded-full",
                      idx === activeImageIndex
                        ? "w-4 h-1.5 bg-white shadow-xs"
                        : "w-1.5 h-1.5 bg-white/60 hover:bg-white/90",
                    ].join(" ")}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Details Grid */}
        <div className="space-y-3 text-xs">
          {/* Price & Location */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60 flex items-center gap-2.5">
              <DollarSign className="size-4 text-primary shrink-0" />
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Price
                </span>
                <span className="font-heading text-sm font-bold text-foreground">
                  ${Number(item.price).toFixed(2)}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60 flex items-center gap-2.5">
              <MapPin className="size-4 text-primary shrink-0" />
              <div className="min-w-0">
                <span className="text-[11px] text-muted-foreground block">
                  Location
                </span>
                <span className="font-semibold text-foreground truncate block">
                  {item.location || "City Center"}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {item.description && (
            <div className="p-3.5 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60">
              <span className="text-[11px] text-muted-foreground block font-medium mb-1">
                Description
              </span>
              <p className="text-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          )}

          {/* Status & Created Date */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60 flex items-center gap-2.5">
              <Tag className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Approval Status
                </span>
                <span className="font-semibold text-foreground capitalize">
                  {item.status || "Pending"}
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-muted/40 dark:bg-muted/30 border border-border/60 flex items-center gap-2.5">
              <Calendar className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-[11px] text-muted-foreground block">
                  Created Date
                </span>
                <span className="font-semibold text-foreground">
                  {formatDate(item.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-border/70 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

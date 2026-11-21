"use client";

import Image from "next/image";
import { CustomerOrder } from "@/types/order";

interface CustomerOrderCardProps {
  order: CustomerOrder;
  onViewDetails: (order: CustomerOrder) => void;
  onCancel: (order: CustomerOrder) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

export function CustomerOrderCard({
  order,
  onViewDetails,
  onCancel,
}: CustomerOrderCardProps) {
  const itemName = order.item?.itemName || "Artisanal Pizza";
  const vendorName =
    order.vendor?.businessName || order.vendor?.name || "Local Pizzeria";
  const location = order.item?.location || "City Center";
  const imageUrl = order.item?.images?.[0] || FALLBACK_IMAGE;

  // Format delivery date (e.g., "2026-11-20" -> "Nov 20, 2026")
  function formatDeliveryDate(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  // Format request/created date
  function formatRequestDate(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Recently";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function renderStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-amber-500 shrink-0" />
            Pending
          </span>
        );
      case "accepted":
        return (
          <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
            Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-rose-500 shrink-0" />
            Rejected
          </span>
        );
      case "cancelled":
      default:
        return (
          <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shrink-0">
            <span className="size-2 rounded-full bg-stone-400 shrink-0" />
            Cancelled
          </span>
        );
    }
  }

  const isPending = order.status === "pending";

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 transition-all hover:shadow-sm">
      {/* Top Section: Thumbnail + Item/Vendor Info + Date / Address Details */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 justify-between">
        {/* Left: Thumbnail & Item details */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-100 dark:border-stone-800">
            <Image
              src={imageUrl}
              alt={itemName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-sm sm:text-base font-bold text-foreground truncate">
              {itemName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {vendorName} · {location}
            </p>
          </div>
        </div>

        {/* Middle/Right: Info Columns (Delivery Date, Address, Requested) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-6 w-full md:w-auto text-left pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
          {/* Delivery Date */}
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium">
              Delivery date
            </span>
            <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 whitespace-nowrap">
              {formatDeliveryDate(order.deliveryDate)}
            </span>
          </div>

          {/* Delivery Address */}
          <div className="flex flex-col min-w-0 max-w-[180px]">
            <span className="text-[11px] text-muted-foreground font-medium">
              Delivery address
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 truncate"
              title={order.deliveryAddress}
            >
              {order.deliveryAddress || "N/A"}
            </span>
          </div>

          {/* Requested Date */}
          <div className="flex flex-col col-span-2 sm:col-span-1">
            <span className="text-[11px] text-muted-foreground font-medium">
              Requested
            </span>
            <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 whitespace-nowrap">
              {formatRequestDate(order.createdAt)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section: Status Pill + Actions (View Details, Cancel) */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
        {/* Status Badge */}
        <div>{renderStatusBadge(order.status)}</div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* View Details */}
          <button
            type="button"
            onClick={() => onViewDetails(order)}
            className="text-xs font-semibold px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-foreground cursor-pointer"
          >
            View Details
          </button>

          {/* Cancel */}
          {isPending ? (
            <button
              type="button"
              onClick={() => onCancel(order)}
              className="text-xs font-semibold px-4 py-1.5 rounded-full border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          ) : (
            <span className="text-xs font-medium px-4 py-1.5 text-stone-300 dark:text-stone-600 select-none cursor-not-allowed">
              Cancel
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

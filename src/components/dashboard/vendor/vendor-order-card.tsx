"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { VendorOrder } from "@/types/vendor";

interface VendorOrderCardProps {
  order: VendorOrder;
  onAccept: (order: VendorOrder) => void;
  onReject: (order: VendorOrder) => void;
  isUpdating?: boolean;
}

const FALLBACK_ITEM_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=300&q=80";

export function VendorOrderCard({
  order,
  onAccept,
  onReject,
  isUpdating,
}: VendorOrderCardProps) {
  const customerName = order.customer?.name || "Customer";
  const customerInitial = customerName.charAt(0).toUpperCase() || "C";
  const customerContact =
    order.customer?.email || order.customer?.phone || "No contact info";

  const itemName = order.item?.itemName || "Custom Pizza";
  const itemPrice =
    order.item?.price !== undefined
      ? `$${Number(order.item.price).toFixed(2)}`
      : "";
  const itemImage = order.item?.images?.[0] || FALLBACK_ITEM_IMAGE;

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

  const deliveryDateFormatted = formatDate(order.deliveryDate);
  const specialInstructions = order.message?.trim() || "No special instructions";

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-3.5 transition-all hover:shadow-sm">
      {/* Top Grid / Main Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
        {/* 1. Customer Avatar & Info */}
        <div className="flex items-center gap-3 min-w-0">
          {order.customer?.image ? (
            <Image
              src={order.customer.image}
              alt={customerName}
              width={40}
              height={40}
              className="size-10 sm:size-11 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="size-10 sm:size-11 rounded-full bg-[#e05638] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {customerInitial}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground truncate">
              {customerName}
            </h4>
            <p className="text-[11px] sm:text-xs text-muted-foreground truncate">
              {customerContact}
            </p>
          </div>
        </div>

        {/* 2. Item Thumbnail & Details */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative size-10 sm:size-11 rounded-2xl overflow-hidden bg-[#faeedb] dark:bg-stone-800 shrink-0 border border-stone-200/60 dark:border-stone-800">
            <Image
              src={itemImage}
              alt={itemName}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>

          <div className="min-w-0">
            <h4 className="font-heading text-xs sm:text-sm font-bold text-foreground truncate">
              {itemName}
            </h4>
            {itemPrice && (
              <p className="text-[11px] sm:text-xs text-muted-foreground font-medium">
                {itemPrice}
              </p>
            )}
          </div>
        </div>

        {/* 3. Delivery Date */}
        <div className="flex flex-col">
          <span className="text-[11px] text-muted-foreground font-medium">
            Delivery date
          </span>
          <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 whitespace-nowrap">
            {deliveryDateFormatted}
          </span>
        </div>

        {/* 4. Delivery Address */}
        <div className="flex flex-col min-w-0">
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
      </div>

      {/* Bottom Section: Customer Message on Left + Status & Actions on Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
        {/* Customer Message */}
        <div className="flex flex-col min-w-0 max-w-xl">
          <span className="text-[11px] text-muted-foreground font-medium">
            Customer message
          </span>
          <p className="text-xs text-stone-600 dark:text-stone-300 italic mt-0.5 truncate">
            &quot;{specialInstructions}&quot;
          </p>
        </div>

        {/* Status Badge & Actions */}
        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
          {order.status === "pending" && (
            <>
              {/* Pending Badge */}
              <span className="bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                Pending
              </span>

              {/* Accept Button */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onAccept(order)}
                className="bg-[#1c4b27] hover:bg-[#163c20] text-white font-semibold text-xs px-4 sm:px-5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
              >
                {isUpdating && <Loader2 className="size-3 animate-spin" />}
                <span>Accept</span>
              </button>

              {/* Reject Button */}
              <button
                type="button"
                disabled={isUpdating}
                onClick={() => onReject(order)}
                className="border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold text-xs px-4 sm:px-5 py-1.5 rounded-full transition-all cursor-pointer disabled:opacity-50"
              >
                Reject
              </button>
            </>
          )}

          {order.status === "accepted" && (
            <div className="flex items-center gap-3">
              <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                Accepted
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Decision made
              </span>
            </div>
          )}

          {order.status === "rejected" && (
            <div className="flex items-center gap-3">
              <span className="bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-rose-500" />
                Rejected
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Decision made
              </span>
            </div>
          )}

          {order.status === "cancelled" && (
            <div className="flex items-center gap-3">
              <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-stone-400" />
                Cancelled
              </span>
              <span className="text-[11px] text-muted-foreground font-medium">
                Cancelled by customer
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

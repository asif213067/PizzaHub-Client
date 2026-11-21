"use client";

import Image from "next/image";
import { VendorMenuItem } from "@/types/vendor";

interface VendorMenuItemCardProps {
  item: VendorMenuItem;
  onToggleActive: (item: VendorMenuItem) => void;
  onView: (item: VendorMenuItem) => void;
  onEdit: (item: VendorMenuItem) => void;
  onDelete: (item: VendorMenuItem) => void;
  isToggling?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

export function VendorMenuItemCard({
  item,
  onToggleActive,
  onView,
  onEdit,
  onDelete,
  isToggling,
}: VendorMenuItemCardProps) {
  const imageUrl = item.images?.[0] || FALLBACK_IMAGE;

  // Determine effective status
  // If isActive is explicitly false or status is inactive, display as Inactive
  const isInactive = item.isActive === false || item.status === "inactive";
  const isApproved = item.status === "approved" && !isInactive;
  const isPending = item.status === "pending" && !isInactive;
  const isRejected = item.status === "rejected" && !isInactive;

  const isSwitchOn = !isInactive && item.status === "approved";

  function renderStatus() {
    if (isApproved) {
      return (
        <div className="flex flex-col items-start sm:items-end">
          <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            Approved
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 text-left sm:text-right">
            Visible to customers
          </span>
        </div>
      );
    }

    if (isPending) {
      return (
        <div className="flex flex-col items-start sm:items-end">
          <span className="bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Pending
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 text-left sm:text-right">
            Waiting for admin review
          </span>
        </div>
      );
    }

    if (isRejected) {
      return (
        <div className="flex flex-col items-start sm:items-end">
          <span className="bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" />
            Rejected
          </span>
          <span className="text-[11px] text-muted-foreground mt-1 text-left sm:text-right">
            Not visible to customers
          </span>
        </div>
      );
    }

    // Default to Inactive
    return (
      <div className="flex flex-col items-start sm:items-end">
        <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-stone-400" />
          Inactive
        </span>
        <span className="text-[11px] text-muted-foreground mt-1 text-left sm:text-right">
          Hidden by you
        </span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 transition-all hover:shadow-sm">
      {/* Top Section: Thumbnail + Item info + Price/Location + Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 justify-between">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-100 dark:border-stone-800">
            <Image
              src={imageUrl}
              alt={item.itemName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0">
            <h3 className="font-heading text-sm sm:text-base font-bold text-foreground truncate">
              {item.itemName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {item.category}
            </p>
          </div>
        </div>

        {/* Middle: Price & Location columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full md:w-auto text-left pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
          {/* Price */}
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-medium">
              Price
            </span>
            <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 whitespace-nowrap">
              ${Number(item.price).toFixed(2)}
            </span>
          </div>

          {/* Location */}
          <div className="flex flex-col min-w-0 max-w-[170px]">
            <span className="text-[11px] text-muted-foreground font-medium">
              Location
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 truncate"
              title={item.location}
            >
              {item.location || "City Center"}
            </span>
          </div>
        </div>

        {/* Right: Status badge & Helper text */}
        <div className="w-full md:w-auto flex md:justify-end pt-1 md:pt-0">
          {renderStatus()}
        </div>
      </div>

      {/* Bottom Section: Availability Toggle + Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800/80">
        {/* Availability Switch Toggle */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
            Available
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isSwitchOn}
            disabled={isToggling}
            onClick={() => onToggleActive(item)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 ${
              isSwitchOn ? "bg-emerald-600" : "bg-stone-300 dark:bg-stone-700"
            }`}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                isSwitchOn ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Action Buttons: View, Edit, Delete */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* View */}
          <button
            type="button"
            onClick={() => onView(item)}
            className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-foreground cursor-pointer"
          >
            View
          </button>

          {/* Edit */}
          <button
            type="button"
            onClick={() => onEdit(item)}
            className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-foreground cursor-pointer"
          >
            Edit
          </button>

          {/* Delete */}
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

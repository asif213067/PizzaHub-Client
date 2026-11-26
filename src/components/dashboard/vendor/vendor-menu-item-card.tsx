"use client";

import Image from "next/image";
import { toast } from "sonner";
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
  // Normalize item fields to guarantee consistent rendering across manual and created items
  const itemName = item.itemName || (item as unknown as { name?: string }).name || "Artisanal Pizza";
  const imageUrl =
    Array.isArray(item.images) && item.images.length > 0 && item.images[0]
      ? item.images[0]
      : typeof (item as unknown as { image?: string }).image === "string" && (item as unknown as { image?: string }).image
      ? (item as unknown as { image?: string }).image!
      : FALLBACK_IMAGE;

  const category = item.category || "Classic";
  const price = typeof item.price === "number" ? item.price : Number(item.price) || 0;
  const location = item.location || "City Center";

  // Determine effective status
  const rawStatus = (item.status || "pending").toLowerCase();
  const isInactive = item.isActive === false || rawStatus === "inactive";
  const isApproved = (rawStatus === "approved" || rawStatus === "accepted") && !isInactive;
  const isPending = rawStatus === "pending" && !isInactive;
  const isRejected = rawStatus === "rejected" && !isInactive;

  // Availability restrictions: Only Accepted/Approved items can be toggled Available/Unavailable.
  const canToggleAvailability = isApproved || (isInactive && rawStatus !== "pending" && rawStatus !== "rejected");
  const isSwitchOn = isApproved && !isInactive;

  const handleAvailableClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPending) {
      toast.error("This item is pending approval and cannot be made available yet.");
      return;
    }

    if (isRejected) {
      toast.error("This item was rejected and cannot be made available to customers.");
      return;
    }

    if (isToggling) return;
    onToggleActive(item);
  };

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

  const renderAvailableToggle = () => (
    <div
      onClick={handleAvailableClick}
      className={`flex items-center gap-2.5 select-none ${
        !canToggleAvailability ? "cursor-not-allowed opacity-60" : "cursor-pointer"
      }`}
      title={
        isPending
          ? "This item is pending approval and cannot be made available yet."
          : isRejected
          ? "This item was rejected and cannot be made available to customers."
          : isSwitchOn
          ? "Click to make this item unavailable"
          : "Click to make this item available"
      }
    >
      <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
        Available
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={isSwitchOn}
        disabled={!canToggleAvailability || isToggling}
        onClick={handleAvailableClick}
        className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
          !canToggleAvailability
            ? "cursor-not-allowed bg-stone-300 dark:bg-stone-700"
            : isSwitchOn
            ? "bg-emerald-600 cursor-pointer"
            : "bg-stone-300 dark:bg-stone-700 cursor-pointer"
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
  );

  const renderViewButton = () => (
    <button
      type="button"
      onClick={() => onView(item)}
      className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-foreground cursor-pointer shrink-0"
    >
      View Details
    </button>
  );

  const renderEditButton = () => (
    <button
      type="button"
      onClick={() => onEdit(item)}
      className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50/60 dark:bg-stone-800/40 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors text-foreground cursor-pointer shrink-0"
    >
      Edit
    </button>
  );

  const renderDeleteButton = () => (
    <button
      type="button"
      onClick={() => onDelete(item)}
      className="text-xs font-semibold px-3.5 sm:px-4 py-1.5 rounded-full border border-rose-300 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer shrink-0"
    >
      Delete
    </button>
  );

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-4 transition-all hover:shadow-sm">
      {/* Top Section: Thumbnail + Item info + Price/Location + Status */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-5 justify-between">
        {/* Left: Thumbnail & Details */}
        <div className="flex items-center gap-3.5 sm:gap-4 min-w-0 flex-1">
          <div className="relative size-16 sm:size-20 rounded-2xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 shadow-2xs border border-stone-100 dark:border-stone-800">
            <Image
              src={imageUrl}
              alt={itemName}
              fill
              className="object-cover"
              sizes="80px"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3
              className="font-heading text-sm sm:text-base font-bold text-foreground truncate block line-clamp-1"
              title={itemName}
            >
              {itemName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate block line-clamp-1">
              {category}
            </p>
            {/* {item.description && (
              <p
                className="text-xs text-muted-foreground/80 mt-1 line-clamp-1 truncate"
                title={item.description}
              >
                {item.description}
              </p>
            )} */}
          </div>
        </div>

        {/* Middle: Price & Location columns */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 w-full md:w-auto text-left pt-2 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800">
          {/* Price */}
          <div className="flex flex-col sm:w-24 shrink-0">
            <span className="text-[11px] text-muted-foreground font-medium">
              Price
            </span>
            <span className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 whitespace-nowrap">
              ${price.toFixed(2)}
            </span>
          </div>

          {/* Location */}
          <div className="flex flex-col min-w-0 max-w-[170px] sm:w-36 shrink-0">
            <span className="text-[11px] text-muted-foreground font-medium">
              Location
            </span>
            <span
              className="text-xs sm:text-sm font-semibold text-foreground mt-0.5 truncate"
              title={location}
            >
              {location}
            </span>
          </div>
        </div>

        {/* Right: Status badge & Helper text */}
        <div className="w-full md:w-auto flex md:justify-end pt-1 md:pt-0 sm:w-36 shrink-0">
          {renderStatus()}
        </div>
      </div>

      {/* Bottom Section: Availability Toggle + Action Buttons */}
      <div className="pt-3 border-t border-stone-100 dark:border-stone-800/80">
        {/* Desktop Layout (sm: and above): Single unchanged horizontal row */}
        <div className="hidden sm:flex items-center justify-between gap-3">
          {renderAvailableToggle()}

          <div className="flex items-center gap-2 sm:gap-2.5">
            {renderViewButton()}
            {renderEditButton()}
            {renderDeleteButton()}
          </div>
        </div>

        {/* Mobile Layout (below sm): Two clean rows */}
        <div className="flex sm:hidden flex-col gap-2.5">
          {/* First row: Available + View Details */}
          <div className="flex items-center justify-between gap-2 w-full">
            {renderAvailableToggle()}
            {renderViewButton()}
          </div>

          {/* Second row: Edit + Delete */}
          <div className="flex items-center justify-end gap-2.5 w-full pt-0.5">
            {renderEditButton()}
            {renderDeleteButton()}
          </div>
        </div>
      </div>
    </div>
  );
}

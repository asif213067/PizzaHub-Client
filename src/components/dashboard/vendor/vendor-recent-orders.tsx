import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowRight } from "lucide-react";
import { VendorOrder } from "@/types/vendor";

interface VendorRecentOrdersProps {
  orders: VendorOrder[];
  loading?: boolean;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

export function VendorRecentOrders({
  orders,
  loading,
}: VendorRecentOrdersProps) {
  const displayOrders = orders.slice(0, 3);

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

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-heading text-sm sm:text-base font-bold text-foreground">
          Recent customer orders
        </h3>
        <Link
          href="/dashboard/vendor/orders"
          className="text-xs sm:text-sm font-semibold text-[#c22d2f] hover:underline flex items-center gap-1 transition-colors"
        >
          View all
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#faf5ee] dark:bg-stone-900/40 rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3 animate-pulse"
            >
              <div className="flex items-center gap-3">
                <div className="size-11 sm:size-12 rounded-xl bg-muted/70 shrink-0" />
                <div className="flex flex-col gap-1.5">
                  <div className="w-32 h-3.5 bg-muted/70 rounded" />
                  <div className="w-24 h-3 bg-muted/60 rounded" />
                </div>
              </div>
              <div className="w-20 h-6 bg-muted/70 rounded-full" />
            </div>
          ))}
        </div>
      ) : displayOrders.length === 0 ? (
        <div className="text-center py-8 px-4 bg-[#faf5ee]/50 dark:bg-stone-900/30 rounded-2xl border border-dashed border-stone-200 dark:border-stone-800 flex flex-col items-center justify-center">
          <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-3">
            <ShoppingBag className="size-6" />
          </div>
          <p className="text-sm font-bold text-foreground">No incoming orders yet</p>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
            When customers place orders for your pizzas, they will show up here for you to accept or reject.
          </p>
          <Link
            href="/dashboard/vendor/items"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full bg-[#c22d2f] text-white hover:bg-[#a82527] transition-all"
          >
            Manage Menu Items <ArrowRight className="size-3.5" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayOrders.map((order) => {
            const customerName =
              order.customer?.name || "Customer";
            const itemName = order.item?.itemName || "Artisanal Pizza";
            const deliveryDateStr = formatDeliveryDate(order.deliveryDate);
            const imageUrl =
              order.item?.images?.[0] || FALLBACK_IMAGE;

            return (
              <div
                key={order._id}
                className="bg-[#faf5ee] dark:bg-stone-900/50 hover:bg-[#f6efe4] dark:hover:bg-stone-900 transition-colors rounded-2xl p-3 sm:p-3.5 flex items-center justify-between gap-3"
              >
                {/* Left: Thumbnail & Details */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative size-11 sm:size-12 rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0 shadow-2xs">
                    <Image
                      src={imageUrl}
                      alt={itemName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-bold text-foreground truncate">
                      {customerName}
                    </p>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 truncate">
                      {itemName} · {deliveryDateStr}
                    </p>
                  </div>
                </div>

                {/* Right: Status Badge */}
                <div>{renderStatusBadge(order.status)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

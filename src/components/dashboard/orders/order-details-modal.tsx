"use client";

import { useEffect } from "react";
import Image from "next/image";
import {
  X,
  Calendar,
  MapPin,
  MessageSquare,
  Store,
  Clock,
  ArrowRight,
} from "lucide-react";
import { CustomerOrder } from "@/types/order";
import Link from "next/link";

interface OrderDetailsModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onCancelRequest?: (order: CustomerOrder) => void;
}

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

export function OrderDetailsModal({
  order,
  isOpen,
  onClose,
  onCancelRequest,
}: OrderDetailsModalProps) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !order) return null;

  const itemName = order.item?.itemName || "Artisanal Pizza";
  const vendorName =
    order.vendor?.businessName || order.vendor?.name || "Local Pizzeria";
  const vendorEmail = order.vendor?.email;
  const category = order.item?.category || "Classic";
  const price = order.item?.price ?? 0;
  const imageUrl = order.item?.images?.[0] || FALLBACK_IMAGE;

  function renderStatusBadge(status: string) {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-100/90 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200/80 dark:border-amber-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-amber-500" />
            Pending Confirmation
          </span>
        );
      case "accepted":
        return (
          <span className="bg-emerald-100/90 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-500" />
            Accepted by Restaurant
          </span>
        );
      case "rejected":
        return (
          <span className="bg-rose-100/90 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-rose-500" />
            Order Rejected
          </span>
        );
      case "cancelled":
      default:
        return (
          <span className="bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-stone-400" />
            Cancelled
          </span>
        );
    }
  }

  function formatDate(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateTime(dateStr?: string) {
    if (!dateStr) return "N/A";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  }

  const isPending = order.status === "pending";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-details-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center justify-between gap-3 mb-4 pr-7">
          <div>
            <h2
              id="order-details-modal-title"
              className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
            >
              Order Details
            </h2>
            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
              ID: {order._id}
            </p>
          </div>
          <div>{renderStatusBadge(order.status)}</div>
        </div>

        {/* Item Summary Card */}
        <div className="bg-muted/40 dark:bg-muted/30 border border-border/70 rounded-2xl p-4 mb-4 flex items-center gap-3.5">
          <div className="relative size-16 sm:size-18 rounded-xl overflow-hidden bg-stone-100 dark:bg-stone-800 shrink-0 border border-border/60">
            <Image
              src={imageUrl}
              alt={itemName}
              fill
              className="object-cover"
              sizes="72px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-bold text-foreground truncate">
              {itemName}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              Category: {category}
            </p>
            <p className="text-sm font-heading font-extrabold text-primary mt-1">
              ${price.toFixed(2)}
            </p>
          </div>
        </div>

        {/* Order Details Grid */}
        <div className="space-y-3.5 text-xs">
          {/* Restaurant / Vendor */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
            <Store className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground block">
                Restaurant
              </span>
              <span className="text-muted-foreground block truncate">
                {vendorName} {vendorEmail ? `(${vendorEmail})` : ""}
              </span>
            </div>
          </div>

          {/* Delivery Date */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
            <Calendar className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground block">
                Delivery Schedule
              </span>
              <span className="text-muted-foreground block">
                {formatDate(order.deliveryDate)}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
            <MapPin className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground block">
                Delivery Address
              </span>
              <span className="text-muted-foreground block">
                {order.deliveryAddress || "N/A"}
              </span>
            </div>
          </div>

          {/* Special Instructions (if any) */}
          {order.message && (
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
              <MessageSquare className="size-4 text-muted-foreground shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-foreground block">
                  Special Instructions
                </span>
                <span className="text-muted-foreground block italic">
                  &ldquo;{order.message}&rdquo;
                </span>
              </div>
            </div>
          )}

          {/* Placed Date Timestamp */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-stone-50 dark:bg-stone-900/50 border border-stone-100 dark:border-stone-800">
            <Clock className="size-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-foreground block">
                Order Timestamp
              </span>
              <span className="text-muted-foreground block">
                Placed on {formatDateTime(order.createdAt)}
              </span>
            </div>
          </div>

          {/* View Product Details */}
          <div className="flex justify-end mt-1">
            <Link
              href={`/menu/${order.item?._id}`}
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
            >
              View Product Details
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="mt-5 pt-4 border-t border-border/70 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Close
          </button>

          {isPending && onCancelRequest && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onCancelRequest(order);
              }}
              className="px-5 py-2 rounded-full border border-rose-300 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-semibold transition-colors cursor-pointer"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

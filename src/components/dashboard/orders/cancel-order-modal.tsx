"use client";

import { useEffect } from "react";
import { AlertTriangle, X, Loader2 } from "lucide-react";
import { CustomerOrder } from "@/types/order";

interface CancelOrderModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  isCancelling: boolean;
  onClose: () => void;
  onConfirmCancel: (order: CustomerOrder) => void;
}

export function CancelOrderModal({
  order,
  isOpen,
  isCancelling,
  onClose,
  onConfirmCancel,
}: CancelOrderModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !isCancelling) onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isCancelling, onClose]);

  if (!isOpen || !order) return null;

  const itemName = order.item?.itemName || "Artisanal Pizza";

  function formatDeliveryDate(dateStr?: string) {
    if (!dateStr) return "the scheduled date";
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
        className="relative w-full max-w-md bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="cancel-order-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={isCancelling}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Warning Icon */}
        <div className="size-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-4">
          <AlertTriangle className="size-6" />
        </div>

        {/* Modal Header */}
        <h2
          id="cancel-order-modal-title"
          className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
        >
          Cancel Order?
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
          Are you sure you want to cancel your order for{" "}
          <strong className="text-foreground font-semibold">{itemName}</strong>{" "}
          scheduled for delivery on{" "}
          <span className="font-semibold text-foreground">
            {formatDeliveryDate(order.deliveryDate)}
          </span>
          ? This action cannot be undone.
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            disabled={isCancelling}
            className="px-5 py-2.5 rounded-full border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          >
            Keep Order
          </button>

          <button
            type="button"
            onClick={() => onConfirmCancel(order)}
            disabled={isCancelling}
            className="px-5 py-2.5 rounded-full bg-destructive text-white hover:bg-destructive/90 text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-60 flex items-center gap-2"
          >
            {isCancelling && <Loader2 className="size-3.5 animate-spin" />}
            {isCancelling ? "Cancelling…" : "Yes, Cancel Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

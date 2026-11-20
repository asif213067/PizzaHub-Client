"use client";

import { useState, useEffect } from "react";
import { X, Calendar, MapPin, MessageSquare, AlertCircle, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { api, getStoredToken, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { MenuItem } from "@/components/shared/pizza-card";

interface OrderModalProps {
  item: MenuItem;
  isOpen: boolean;
  onClose: () => void;
}

export function OrderModal({ item, isOpen, onClose }: OrderModalProps) {
  const { data: session } = useSession();

  // Today's date formatted as YYYY-MM-DD for min date attribute
  const todayStr = new Date().toISOString().split("T")[0];

  const [deliveryDate, setDeliveryDate] = useState(todayStr);
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!deliveryDate) {
      setError("Please select a delivery date.");
      return;
    }

    if (!deliveryAddress.trim()) {
      setError("Please provide a delivery address.");
      return;
    }

    setSubmitting(true);

    try {
      // Ensure backend JWT token is synced if missing from localStorage
      if (!getStoredToken() && session?.user?.email) {
        await syncAuthToken(session.user.email);
      }

      await api.post("/api/orders", {
        itemId: item._id,
        deliveryDate: deliveryDate.trim(),
        deliveryAddress: deliveryAddress.trim(),
        message: message.trim(),
      });

      toast.success("Order placed successfully! The restaurant will review your order.");
      // Reset form fields
      setDeliveryAddress("");
      setMessage("");
      setDeliveryDate(todayStr);
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to place order.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const vendorName =
    item.vendor?.businessName || item.vendor?.name || "Local Pizzeria";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-order-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="size-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="size-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <ShoppingBag className="size-5" />
          </div>
          <div>
            <h2
              id="place-order-modal-title"
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground"
            >
              Place Your Order
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Confirm your delivery schedule and address
            </p>
          </div>
        </div>

        {/* Item Summary Card */}
        <div className="bg-muted/40 dark:bg-muted/30 border border-border/70 rounded-2xl p-4 mb-5 flex items-center justify-between">
          <div className="min-w-0 pr-3">
            <p className="text-sm font-bold text-foreground truncate">{item.itemName}</p>
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              by {vendorName} · {item.category}
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-lg font-heading font-extrabold text-primary">
              ${item.price.toFixed(2)}
            </p>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">
              Total price
            </span>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 flex items-center gap-2 p-3 text-xs sm:text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-2xl">
            <AlertCircle className="size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Delivery Date */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="order-delivery-date"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5 pl-1"
            >
              <Calendar className="size-3.5 text-muted-foreground" />
              Delivery Date
            </label>
            <input
              id="order-delivery-date"
              type="date"
              required
              min={todayStr}
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Delivery Address */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="order-delivery-address"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5 pl-1"
            >
              <MapPin className="size-3.5 text-muted-foreground" />
              Delivery Address
            </label>
            <input
              id="order-delivery-address"
              type="text"
              required
              placeholder="Street, area, city"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-full px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
            />
          </div>

          {/* Special Instructions */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="order-special-instructions"
              className="text-xs font-semibold text-foreground flex items-center gap-1.5 pl-1"
            >
              <MessageSquare className="size-3.5 text-muted-foreground" />
              Special Instructions
            </label>
            <textarea
              id="order-special-instructions"
              rows={2}
              placeholder="e.g. Extra crispy crust, ring bell upon arrival"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-muted/50 dark:bg-muted border border-border rounded-2xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition resize-none"
            />
          </div>

          {/* Full-width Place Order Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-6 rounded-full bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white font-semibold text-sm sm:text-base shadow-md transition-all cursor-pointer disabled:opacity-60 text-center"
            >
              {submitting ? "Placing Order…" : "Place Order"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

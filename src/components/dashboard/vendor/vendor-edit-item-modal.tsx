"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { VendorMenuItem } from "@/types/vendor";

interface VendorEditItemModalProps {
  item: VendorMenuItem | null;
  isOpen: boolean;
  onClose: () => void;
  onItemUpdated: (updatedItem: VendorMenuItem) => void;
}

const CATEGORIES = [
  "Classic",
  "Vegetarian",
  "Meat Lovers",
  "Specialty / Gourmet",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export function VendorEditItemModal({
  item,
  isOpen,
  onClose,
  onItemUpdated,
}: VendorEditItemModalProps) {
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("Classic");
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      setItemName(item.itemName || "");
      setCategory(item.category || "Classic");
      setPrice(String(item.price ?? ""));
      setLocation(item.location || "");
      setDescription(item.description || "");
      setError(null);
    }
  }, [item]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
    }
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, submitting, onClose]);

  if (!isOpen || !item) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!itemName.trim()) {
      setError("Item name is required.");
      return;
    }

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError("Please enter a valid positive price.");
      return;
    }

    if (!location.trim()) {
      setError("Location is required.");
      return;
    }

    if (!item) return;

    try {
      setSubmitting(true);

      const res = await api.put<{ success: boolean; data: VendorMenuItem }>(
        `/api/menu/${item._id}`,
        {
          itemName: itemName.trim(),
          category,
          price: numPrice,
          location: location.trim(),
          description: description.trim(),
        }
      );

      if (res?.success && res.data) {
        toast.success("Menu item updated successfully!");
        onItemUpdated(res.data);
        onClose();
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to update item.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-5 sm:p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto"
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-item-modal-title"
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
          aria-label="Close dialog"
        >
          <X className="size-4" />
        </button>

        {/* Modal Header */}
        <div className="mb-4 pr-7">
          <h2
            id="edit-item-modal-title"
            className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
          >
            Edit Menu Item
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Update pricing, category, and details for this pizza
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-xs">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Item Name */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-name"
              className="font-semibold text-foreground"
            >
              Item Name *
            </label>
            <input
              id="edit-item-name"
              type="text"
              required
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
            />
          </div>

          {/* Category & Price */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label
                htmlFor="edit-item-category"
                className="font-semibold text-foreground"
              >
                Category *
              </label>
              <select
                id="edit-item-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label
                htmlFor="edit-item-price"
                className="font-semibold text-foreground"
              >
                Price ($) *
              </label>
              <input
                id="edit-item-price"
                type="number"
                step="0.01"
                min="0.5"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-location"
              className="font-semibold text-foreground"
            >
              Location (Area, City) *
            </label>
            <input
              id="edit-item-location"
              type="text"
              required
              placeholder="e.g. Downtown, Pabna"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label
              htmlFor="edit-item-description"
              className="font-semibold text-foreground"
            >
              Description
            </label>
            <textarea
              id="edit-item-description"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the crust, toppings, cheese, and special preparation..."
              className="w-full bg-muted/40 dark:bg-muted/30 border border-border rounded-xl px-3.5 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-border/70 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-full bg-[#c22d2f] hover:bg-[#a82527] active:scale-95 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-60 cursor-pointer"
            >
              {submitting ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

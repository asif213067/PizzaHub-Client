"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";

interface VendorUpgradeLimitModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VendorUpgradeLimitModal({
  isOpen,
  onClose,
}: VendorUpgradeLimitModalProps) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-md bg-card text-card-foreground border border-border/80 rounded-3xl shadow-2xl p-6 animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="upgrade-limit-modal-title"
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

        {/* Premium Badge Icon */}
        <div className="size-12 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 flex items-center justify-center mb-4">
          <Sparkles className="size-6" />
        </div>

        {/* Modal Header */}
        <h2
          id="upgrade-limit-modal-title"
          className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground"
        >
          Free Tier Limit Reached
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
          You currently have 3 active menu items, which is the maximum allowed
          on the <strong>Free tier</strong>. To activate more pizzas and reach more
          customers, upgrade to <strong>Premium</strong> for unlimited menu items!
        </p>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 pt-3 border-t border-border/60">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <Link
            href="/dashboard/vendor/subscription"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#c22d2f] hover:bg-[#a82527] active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md transition-all text-center"
          >
            Upgrade to Premium
          </Link>
        </div>
      </div>
    </div>
  );
}

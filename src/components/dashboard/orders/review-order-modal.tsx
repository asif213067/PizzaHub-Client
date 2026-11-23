"use client";

import { useState } from "react";
import Image from "next/image";
import { Star, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CustomerOrder, OrderReview } from "@/types/order";
import { useAddReview } from "@/hooks/queries";

interface ReviewOrderModalProps {
  order: CustomerOrder | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string, review: OrderReview) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor - Needs improvement",
  2: "Fair - Okay, but expected more",
  3: "Good - Satisfying pizza",
  4: "Very Good - Loved the flavor",
  5: "Excellent - Outstanding pizza & service!",
};

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80";

export function ReviewOrderModal({
  order,
  isOpen,
  onClose,
  onSuccess,
}: ReviewOrderModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addReviewMutation = useAddReview();

  if (!isOpen || !order) return null;

  const itemName = order.item?.itemName || "Artisanal Pizza";
  const vendorName =
    order.vendor?.businessName || order.vendor?.name || "Local Pizzeria";
  const imageUrl = order.item?.images?.[0] || FALLBACK_IMAGE;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!order) return;

    if (!comment.trim()) {
      setError("Please write a few words about your experience.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Please choose a star rating from 1 to 5.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const res = await addReviewMutation.mutateAsync({
        orderId: order._id,
        rating,
        comment: comment.trim(),
      });

      if (res?.success && res.data) {
        toast.success(res.message || "Thank you! Your review has been published.");
        onSuccess(order._id, res.data);
        onClose();
        setComment("");
        setRating(5);
      } else {
        throw new Error(res?.message || "Failed to submit review.");
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to submit review. Please try again.";
      setError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  const activeRating = hoverRating || rating;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/60">
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              Write a Review
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Share your feedback on your accepted pizza order.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="size-8 rounded-full flex items-center justify-center hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            aria-label="Close review dialog"
          >
            <X size={18} />
          </button>
        </div>

        {/* Product Preview Card */}
        <div className="flex items-center gap-3.5 p-3.5 my-4 rounded-2xl bg-muted/40 border border-border/60">
          <div className="relative size-14 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
            <Image
              src={imageUrl}
              alt={itemName}
              fill
              className="object-cover"
              sizes="56px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="font-heading text-sm font-bold text-foreground truncate">
              {itemName}
            </h4>
            <p className="text-xs text-muted-foreground truncate">
              {vendorName}
            </p>
          </div>
        </div>

        {/* Review Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Star Rating Section */}
          <div className="flex flex-col items-center justify-center gap-2 py-2">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = star <= activeRating;
                return (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                    className="p-1 rounded-lg transition-transform hover:scale-115 active:scale-95 focus:outline-hidden cursor-pointer"
                  >
                    <Star
                      className={`size-7 transition-colors ${
                        isFilled
                          ? "text-orange-500 fill-orange-500 drop-shadow-xs"
                          : "text-stone-300 dark:text-stone-700"
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-medium text-muted-foreground h-4">
              {RATING_LABELS[activeRating] || ""}
            </p>
          </div>

          {/* Comment Textarea */}
          <div className="flex flex-col gap-1.5 text-left">
            <label
              htmlFor="review-comment"
              className="text-xs font-semibold text-foreground"
            >
              Your Feedback <span className="text-destructive">*</span>
            </label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="How was the crust, cheese, toppings, and taste? Was it delivered hot and fresh?"
              rows={4}
              maxLength={600}
              className="w-full text-xs sm:text-sm rounded-2xl border border-input bg-background/50 px-3.5 py-2.5 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-hidden transition-all resize-none text-foreground"
              required
            />
            <div className="flex justify-between items-center text-[11px] text-muted-foreground px-1">
              <span>Detailed reviews help other pizza lovers decide!</span>
              <span>{comment.length}/600</span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-xl px-3 py-2">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 rounded-full border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-[image:var(--gradient-primary)] hover:brightness-105 active:scale-95 text-white text-xs font-bold shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting && <Loader2 className="size-3.5 animate-spin" />}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

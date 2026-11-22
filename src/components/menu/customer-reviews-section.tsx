"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { api } from "@/lib/api-client";
import { OrderReview } from "@/types/order";

interface CustomerReviewsSectionProps {
  itemId: string;
}

interface ItemReviewsResponse {
  success: boolean;
  totalReviews: number;
  averageRating: number;
  data: OrderReview[];
}

export function CustomerReviewsSection({ itemId }: CustomerReviewsSectionProps) {
  const [reviews, setReviews] = useState<OrderReview[]>([]);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Responsive items count: 3 on desktop, 2 on tablet, 1 on mobile
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(3);
      } else if (window.innerWidth >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function fetchReviews() {
      try {
        setLoading(true);
        const res = await api.get<ItemReviewsResponse>(`/api/reviews/item/${itemId}`);
        if (isMounted && res) {
          setReviews(res.data || []);
          setTotalReviews(res.totalReviews || 0);
          setAverageRating(res.averageRating || 0);
        }
      } catch (err) {
        console.error("Failed to load customer reviews for item:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    if (itemId) {
      fetchReviews();
    }

    return () => {
      isMounted = false;
    };
  }, [itemId]);

  // Adjust startIndex if out of bounds after resize or reviews change
  const maxStartIndex = Math.max(0, reviews.length - itemsPerPage);
  const currentStartIndex = Math.min(startIndex, maxStartIndex);

  const canPrev = currentStartIndex > 0;
  const canNext = currentStartIndex < maxStartIndex;

  function handlePrev() {
    setStartIndex((prev) => Math.max(0, prev - itemsPerPage));
  }

  function handleNext() {
    setStartIndex((prev) => Math.min(maxStartIndex, prev + itemsPerPage));
  }

  const visibleReviews = reviews.slice(
    currentStartIndex,
    currentStartIndex + itemsPerPage
  );

  function formatDate(dateStr?: string) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }

  return (
    <section className="w-full mt-10 sm:mt-14 rounded-3xl bg-card border border-border/80 p-5 sm:p-7 shadow-xs">
      {/* Top Header Area */}
      <div className={`flex flex-col gap-2.5 ${reviews.length > 0 ? "pb-5" : ""}`}>
        <h2 className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          Customer Reviews
        </h2>

        {/* Subheader: Rating Summary on left + Previous / Next Navigation on right */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Rating Summary */}
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-muted-foreground font-medium">
            <Star className="size-4 sm:size-4.5 text-amber-500 fill-amber-500 shrink-0" />
            <span>
              {totalReviews > 0 ? (
                <>
                  <strong className="text-foreground font-bold">{averageRating}</strong>
                  {" · "}
                  {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
                </>
              ) : (
                <>
                  <strong className="text-foreground font-bold">0.0</strong> · 0 reviews
                </>
              )}
            </span>
          </div>

          {/* Navigation Controls: ← Previous / Next → */}
          {reviews.length > itemsPerPage && (
            <div className="flex items-center gap-2 text-xs sm:text-sm font-medium">
              <button
                type="button"
                onClick={handlePrev}
                disabled={!canPrev}
                className={`transition-colors cursor-pointer select-none ${
                  canPrev
                    ? "text-muted-foreground hover:text-foreground font-medium"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
                aria-label="Previous reviews"
              >
                &larr; Previous
              </button>
              <span className="text-border">/</span>
              <button
                type="button"
                onClick={handleNext}
                disabled={!canNext}
                className={`transition-colors cursor-pointer select-none ${
                  canNext
                    ? "text-muted-foreground hover:text-foreground font-medium"
                    : "text-muted-foreground/30 cursor-not-allowed"
                }`}
                aria-label="Next reviews"
              >
                Next &rarr;
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-muted/40 border border-border/60 p-4 sm:p-5 h-44 animate-pulse"
            />
          ))}
        </div>
      ) : reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visibleReviews.map((review) => {
            const customerName = review.customerName || "Customer";
            const reviewDate = formatDate(review.createdAt);

            return (
              <div
                key={review._id || `${review.orderId}-${review.createdAt}`}
                className="rounded-2xl bg-muted/30 dark:bg-muted/15 border border-border/80 dark:border-border/60 p-4 sm:p-5 flex flex-col justify-between gap-3 transition-all hover:border-primary/40 hover:shadow-2xs"
              >
                {/* Header: Squircle Avatar + Customer Name + Review Date */}
                <div className="flex items-center gap-3">
                  <div className="size-11 sm:size-12 rounded-2xl bg-background border border-border/70 p-0.5 shrink-0 flex items-center justify-center overflow-hidden shadow-2xs">
                    {review.customerImage ? (
                      <Image
                        src={review.customerImage}
                        alt={customerName}
                        width={44}
                        height={44}
                        className="size-full rounded-xl object-cover"
                      />
                    ) : (
                      <div className="size-full rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {customerName.charAt(0).toUpperCase() || <User size={18} />}
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="font-heading font-bold text-foreground text-base sm:text-lg leading-tight truncate">
                      {customerName}
                    </h4>
                    {reviewDate && (
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {reviewDate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Stars Rating: 5 stars (orange-500 filled vs empty) */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= review.rating
                          ? "text-orange-500 fill-orange-500 drop-shadow-2xs"
                          : "text-stone-300 dark:text-stone-700"
                      }`}
                    />
                  ))}
                </div>

                {/* Comment Text */}
                <p className="text-foreground/90 text-xs sm:text-sm leading-relaxed flex-1">
                  {review.comment}
                </p>
              </div>
            );
          })}
        </div>
      ) : null}
    </section>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Star,
  Trash2,
  Eye,
  Loader2,
  AlertTriangle,
  Building2,
  Calendar,
  Pizza,
  User,
  CheckCircle2,
  X,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { AdminReview } from "@/types/admin";
import { api } from "@/lib/api-client";

interface AdminReviewTableProps {
  reviews: AdminReview[];
  totalReviews: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onRatingFilterChange: (rating: string) => void;
  selectedRating: string;
  searchQuery: string;
  onReviewDeleted?: () => void;
}

export function AdminReviewTable({
  reviews,
  totalReviews,
  currentPage,
  totalPages,
  loading,
  onPageChange,
  onSearchChange,
  onRatingFilterChange,
  selectedRating,
  searchQuery,
  onReviewDeleted,
}: AdminReviewTableProps) {
  // Modal states
  const [viewingReview, setViewingReview] = useState<AdminReview | null>(null);
  const [deletingReview, setDeletingReview] = useState<AdminReview | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle Permanent Delete
  async function handleDeleteConfirm() {
    if (!deletingReview) return;
    try {
      setIsDeleting(true);
      const res = await api.delete<{ success: boolean; message: string }>(
        `/api/reviews/${deletingReview._id}`
      );

      if (res?.success) {
        toast.success("Review deleted successfully. Item ratings updated.");
        setDeletingReview(null);
        if (onReviewDeleted) {
          onReviewDeleted();
        }
      } else {
        toast.error(res?.message || "Failed to delete review.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete review.";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
    }
  }

  // Calculate average rating of currently loaded reviews for summary badge
  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="font-heading text-lg font-bold text-foreground">
              Reviews Management
            </h2>
            {averageRating && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                <Star className="size-3 fill-amber-400 text-amber-500" />
                {averageRating} Avg
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalReviews} customer review{totalReviews === 1 ? "" : "s"} across all partner pizzerias
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search reviewer, pizza, or pizzeria..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition"
            />
          </div>

          {/* Rating Filter */}
          <select
            value={selectedRating}
            onChange={(e) => onRatingFilterChange(e.target.value)}
            className="bg-muted/40 dark:bg-muted border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Ratings</option>
            <option value="5">5 Stars (Excellent)</option>
            <option value="4">4 Stars (Good)</option>
            <option value="3">3 Stars (Average)</option>
            <option value="2">2 Stars (Fair)</option>
            <option value="1">1 Star (Poor)</option>
          </select>
        </div>
      </div>

      {/* Content: Skeletons, Empty State, or Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 rounded-2xl bg-muted/20 animate-pulse gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="w-32 h-3.5 bg-muted/60 rounded" />
                  <div className="w-48 h-3 bg-muted/40 rounded" />
                </div>
              </div>
              <div className="w-24 h-6 bg-muted/50 rounded-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div className="size-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-400 mb-3">
            <MessageSquare className="size-7 stroke-[1.5]" />
          </div>
          <h3 className="font-heading text-sm font-semibold text-foreground">
            No reviews found
          </h3>
          <p className="text-xs text-muted-foreground max-w-sm mt-1">
            {searchQuery || selectedRating !== "all"
              ? "Try adjusting your search query or rating filter."
              : "Customer reviews for orders will appear here automatically."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200/60 dark:border-stone-800 text-muted-foreground uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3 font-semibold">Customer</th>
                  <th className="py-3 px-3 font-semibold">Pizza / Item</th>
                  <th className="py-3 px-3 font-semibold">Vendor</th>
                  <th className="py-3 px-3 font-semibold">Rating</th>
                  <th className="py-3 px-3 font-semibold">Comment</th>
                  <th className="py-3 px-3 font-semibold">Date</th>
                  <th className="py-3 px-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800/60">
                {reviews.map((r) => (
                  <tr
                    key={r._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Customer */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {r.customerImage ? (
                          <div className="relative size-8 rounded-full overflow-hidden shrink-0 border border-border">
                            <Image
                              src={r.customerImage}
                              alt={r.customerName}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-8 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                            {r.customerName?.charAt(0) || "U"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <span className="font-semibold text-foreground block truncate">
                            {r.customerName}
                          </span>
                          {r.verifiedPurchase && (
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium inline-flex items-center gap-0.5">
                              <CheckCircle2 className="size-2.5" />
                              Verified
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Item */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        {r.itemImage ? (
                          <div className="relative size-7 rounded-lg overflow-hidden shrink-0 border border-border">
                            <Image
                              src={r.itemImage}
                              alt={r.itemName || "Item"}
                              fill
                              sizes="28px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="size-7 rounded-lg bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-muted-foreground shrink-0">
                            <Pizza className="size-3.5" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[160px]">
                          <span className="font-medium text-foreground block truncate" title={r.itemName}>
                            {r.itemName || "Pizza Item"}
                          </span>
                          {r.itemCategory && (
                            <span className="text-[10px] text-muted-foreground block truncate">
                              {r.itemCategory}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Vendor */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-muted-foreground max-w-[150px]">
                        <Building2 className="size-3 shrink-0 text-stone-400" />
                        <span className="truncate font-medium text-foreground text-xs" title={r.vendorName}>
                          {r.vendorName || "Pizzeria Partner"}
                        </span>
                      </div>
                    </td>

                    {/* Rating */}
                    <td className="py-3 px-3">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs">
                        <Star className="size-3 fill-amber-400 text-amber-500" />
                        <span>{r.rating}.0</span>
                      </div>
                    </td>

                    {/* Comment preview */}
                    <td className="py-3 px-3">
                      <p
                        className="text-xs text-muted-foreground max-w-[220px] truncate"
                        title={r.comment}
                      >
                        {r.comment}
                      </p>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-3 text-muted-foreground text-[11px] whitespace-nowrap">
                      {new Date(r.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setViewingReview(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-foreground transition cursor-pointer"
                          title="View Review Details"
                        >
                          <Eye className="size-3 text-muted-foreground" />
                          <span>View</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingReview(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                          title="Permanently Delete Review"
                        >
                          <Trash2 className="size-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile & Tablet Card View */}
          <div className="lg:hidden flex flex-col gap-3">
            {reviews.map((r) => (
              <div
                key={r._id}
                className="p-4 rounded-2xl border border-stone-200/60 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/30 flex flex-col gap-3"
              >
                {/* Header: Customer + Rating */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {r.customerImage ? (
                      <div className="relative size-9 rounded-full overflow-hidden shrink-0 border border-border">
                        <Image
                          src={r.customerImage}
                          alt={r.customerName}
                          fill
                          sizes="36px"
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="size-9 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-xs shrink-0">
                        {r.customerName?.charAt(0) || "U"}
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-foreground text-sm block">
                        {r.customerName}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(r.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-xs shrink-0">
                    <Star className="size-3 fill-amber-400 text-amber-500" />
                    <span>{r.rating}.0</span>
                  </div>
                </div>

                {/* Details: Pizza & Vendor */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-200/40 dark:border-stone-800/40">
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Pizza Item
                    </span>
                    <span className="font-medium text-foreground truncate block">
                      {r.itemName || "Pizza Item"}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider block">
                      Vendor / Pizzeria
                    </span>
                    <span className="font-medium text-foreground truncate block">
                      {r.vendorName || "Partner Pizzeria"}
                    </span>
                  </div>
                </div>

                {/* Comment */}
                <p className="text-xs text-muted-foreground italic line-clamp-2">
                  &ldquo;{r.comment}&rdquo;
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setViewingReview(r)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-foreground transition cursor-pointer"
                  >
                    <Eye className="size-3.5 text-muted-foreground" />
                    <span>View Review</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingReview(r)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded-full border border-border text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded-full border border-border text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 1: VIEW REVIEW DETAILS ─────────────────────────────────── */}
      {viewingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-card border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 dark:border-stone-800 pb-3">
              <div className="flex items-center gap-3">
                {viewingReview.customerImage ? (
                  <div className="relative size-12 rounded-full overflow-hidden border border-border shrink-0">
                    <Image
                      src={viewingReview.customerImage}
                      alt={viewingReview.customerName}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-12 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-base shrink-0">
                    <User className="size-6" />
                  </div>
                )}
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {viewingReview.customerName}
                  </h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    {viewingReview.verifiedPurchase && (
                      <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                        <CheckCircle2 className="size-3" />
                        Verified Purchase
                      </span>
                    )}
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(viewingReview.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setViewingReview(null)}
                className="size-8 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Pizza & Vendor Metadata Box */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-900/50 border border-stone-200/50 dark:border-stone-800/50">
              {/* Pizza Item */}
              <div className="flex items-center gap-2.5">
                {viewingReview.itemImage ? (
                  <div className="relative size-11 rounded-xl overflow-hidden shrink-0 border border-border">
                    <Image
                      src={viewingReview.itemImage}
                      alt={viewingReview.itemName || "Pizza"}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="size-11 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
                    <Pizza className="size-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                    Pizza Item
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {viewingReview.itemName || "Pizza"}
                  </span>
                  {viewingReview.itemCategory && (
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {viewingReview.itemCategory}
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Pizzeria */}
              <div className="flex items-center gap-2.5">
                <div className="size-11 rounded-xl bg-muted flex items-center justify-center text-stone-500 shrink-0">
                  <Building2 className="size-5" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider block font-medium">
                    Vendor / Pizzeria
                  </span>
                  <span className="font-semibold text-foreground text-xs block truncate">
                    {viewingReview.vendorName || "Pizzeria Partner"}
                  </span>
                  {viewingReview.vendorEmail && (
                    <span className="text-[10px] text-muted-foreground block truncate">
                      {viewingReview.vendorEmail}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Star Rating Display */}
            <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-500/5 border border-amber-500/10">
              <span className="text-xs font-semibold text-foreground">
                Customer Rating:
              </span>
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`size-4 ${
                        star <= viewingReview.rating
                          ? "fill-amber-400 text-amber-500"
                          : "text-stone-300 dark:text-stone-700"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-700 dark:text-amber-400 ml-1">
                  {viewingReview.rating} out of 5
                </span>
              </div>
            </div>

            {/* Comment Section */}
            <div>
              <span className="text-xs font-semibold text-foreground block mb-1.5">
                Review Feedback:
              </span>
              <div className="p-4 rounded-2xl bg-muted/30 border border-stone-200/60 dark:border-stone-800 text-xs text-foreground leading-relaxed italic">
                &ldquo;{viewingReview.comment}&rdquo;
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
              <button
                type="button"
                onClick={() => {
                  const rev = viewingReview;
                  setViewingReview(null);
                  setDeletingReview(rev);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                <span>Delete Review</span>
              </button>

              <button
                type="button"
                onClick={() => setViewingReview(null)}
                className="px-4 py-1.5 rounded-full text-xs font-semibold bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 hover:opacity-90 transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: CONFIRM DELETE REVIEW ───────────────────────────────── */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-card border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded-2xl bg-rose-50 dark:bg-rose-950 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="size-5" />
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  Permanently Delete Review?
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  Are you sure you want to delete this review by{" "}
                  <strong className="text-foreground">{deletingReview.customerName}</strong> for{" "}
                  <strong className="text-foreground">{deletingReview.itemName || "this item"}</strong>?
                </p>
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-[11px] text-muted-foreground space-y-1">
              <p className="font-semibold text-rose-700 dark:text-rose-400">
                ⚠️ Platform Integrity Notice:
              </p>
              <p>
                Deleting this review will permanently purge it from MongoDB and automatically recalculate the menu item&apos;s overall star rating and total review counts.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setDeletingReview(null)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-foreground cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="size-3.5" />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AdminReviewTable } from "@/components/dashboard/admin/admin-review-table";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { AdminReview } from "@/types/admin";

export default function AdminReviewsPage() {
  const { data: session } = useSession();

  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");

  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: reviewPage.toString(),
        limit: "15",
        rating: reviewRatingFilter,
        ...(reviewSearch.trim() ? { search: reviewSearch.trim() } : {}),
      });

      const res = await api.get<{
        success: boolean;
        data: AdminReview[];
        pagination: { total: number; totalPages: number };
      }>(`/api/admin/reviews?${queryParams.toString()}`);

      if (res?.data) {
        setReviews(res.data);
        setReviewTotalPages(res.pagination?.totalPages || 1);
        setTotalReviewsCount(res.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load customer reviews.");
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewPage, reviewRatingFilter, reviewSearch]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Reviews Management"
        subtitle="Inspect customer ratings, review feedback, and moderate reviews across all vendor kitchens."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6">
        <AdminReviewTable
          reviews={reviews}
          totalReviews={totalReviewsCount}
          currentPage={reviewPage}
          totalPages={reviewTotalPages}
          loading={reviewsLoading}
          onPageChange={setReviewPage}
          onSearchChange={(q) => {
            setReviewSearch(q);
            setReviewPage(1);
          }}
          onRatingFilterChange={(r) => {
            setReviewRatingFilter(r);
            setReviewPage(1);
          }}
          selectedRating={reviewRatingFilter}
          searchQuery={reviewSearch}
          onReviewDeleted={fetchReviews}
        />
      </main>
    </div>
  );
}

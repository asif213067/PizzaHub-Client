import { api } from "@/lib/api-client";
import { OrderReview } from "@/types/order";
import { AdminReview } from "@/types/admin";

export interface AddReviewPayload {
  orderId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewPayload {
  rating: number;
  comment: string;
}

export interface ItemReviewsResponse {
  success: boolean;
  count?: number;
  totalReviews?: number;
  averageRating: number;
  data: OrderReview[];
}

export interface ReviewsResponse<T = OrderReview> {
  success: boolean;
  count: number;
  data: T[];
}

export const reviewService = {
  // Public item reviews
  getItemReviews: (itemId: string) =>
    api.get<ItemReviewsResponse>(`/api/reviews/item/${itemId}`),

  // Customer order review
  getReviewByOrderId: (orderId: string) =>
    api.get<{ success: boolean; data: OrderReview | null }>(`/api/reviews/order/${orderId}`),

  getMyReviews: () =>
    api.get<ReviewsResponse<OrderReview>>("/api/reviews/my-reviews"),

  addReview: (payload: AddReviewPayload) =>
    api.post<{ success: boolean; message: string; data: OrderReview }>("/api/reviews", payload),

  updateReview: (reviewId: string, payload: UpdateReviewPayload) =>
    api.patch<{ success: boolean; message: string; data: OrderReview }>(
      `/api/reviews/${reviewId}`,
      payload
    ),

  deleteReview: (reviewId: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/reviews/${reviewId}`),

  // Vendor reviews
  getVendorReviews: () =>
    api.get<ReviewsResponse<OrderReview>>("/api/reviews/vendor"),

  // Admin reviews
  getAllReviewsAdmin: (params: {
    page?: number | string;
    limit?: number | string;
    rating?: string;
    search?: string;
  } = {}) => {
    const query = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 15).toString(),
      rating: params.rating || "all",
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    }).toString();
    return api.get<
      ReviewsResponse<AdminReview> & { pagination?: { total: number; totalPages: number } }
    >(`/api/admin/reviews?${query}`);
  },
};

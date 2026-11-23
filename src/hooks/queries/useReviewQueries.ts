import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  reviewService,
  AddReviewPayload,
  UpdateReviewPayload,
} from "@/services/review.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

export function useItemReviews(itemId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.item(itemId),
    queryFn: () => reviewService.getItemReviews(itemId),
    enabled: Boolean(itemId),
    staleTime: CACHE_POLICIES.REVIEWS.staleTime,
    gcTime: CACHE_POLICIES.REVIEWS.gcTime,
  });
}

export function useOrderReview(orderId: string) {
  return useQuery({
    queryKey: queryKeys.reviews.order(orderId),
    queryFn: () => reviewService.getReviewByOrderId(orderId),
    enabled: Boolean(orderId),
    staleTime: CACHE_POLICIES.REVIEWS.staleTime,
  });
}

export function useMyReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.myReviews(),
    queryFn: () => reviewService.getMyReviews(),
    staleTime: CACHE_POLICIES.REVIEWS.staleTime,
  });
}

export function useVendorReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.vendor(),
    queryFn: () => reviewService.getVendorReviews(),
    staleTime: CACHE_POLICIES.REVIEWS.staleTime,
  });
}

export function useAdminReviews() {
  return useQuery({
    queryKey: queryKeys.reviews.admin(),
    queryFn: () => reviewService.getAllReviewsAdmin(),
    staleTime: CACHE_POLICIES.ADMIN_DATA.staleTime,
    gcTime: CACHE_POLICIES.ADMIN_DATA.gcTime,
    refetchOnWindowFocus: CACHE_POLICIES.ADMIN_DATA.refetchOnWindowFocus,
  });
}

// Review Mutations with immediate invalidation
export function useAddReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddReviewPayload) => reviewService.addReview(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
    },
  });
}

export function useUpdateReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ reviewId, payload }: { reviewId: string; payload: UpdateReviewPayload }) =>
      reviewService.updateReview(reviewId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
    },
  });
}

export function useDeleteReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reviewId: string) => reviewService.deleteReview(reviewId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.reviews.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

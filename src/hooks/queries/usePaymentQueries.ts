import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { paymentService, CreateCheckoutSessionPayload } from "@/services/payment.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

export function useSubscriptionStatus() {
  return useQuery({
    queryKey: queryKeys.payment.subscriptionStatus(),
    queryFn: () => paymentService.getSubscriptionStatus(),
    staleTime: CACHE_POLICIES.VENDOR_PROFILE.staleTime,
    gcTime: CACHE_POLICIES.VENDOR_PROFILE.gcTime,
  });
}

export function useVendorTransactions() {
  return useQuery({
    queryKey: queryKeys.payment.vendorTransactions(),
    queryFn: () => paymentService.getVendorTransactions(),
    staleTime: CACHE_POLICIES.VENDOR_MENU.staleTime,
  });
}

export function useCreateCheckoutSession() {
  return useMutation({
    mutationFn: (payload: CreateCheckoutSessionPayload) =>
      paymentService.createCheckoutSession(payload),
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => paymentService.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payment.subscriptionStatus() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
    },
  });
}

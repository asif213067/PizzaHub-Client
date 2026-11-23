import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { orderService, CreateOrderPayload } from "@/services/order.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

// Customer Orders Hook
export function useCustomerOrders() {
  return useQuery({
    queryKey: queryKeys.orders.myOrders(),
    queryFn: () => orderService.getMyOrders(),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
  });
}

// Vendor Orders Hook with automatic 60s background polling (disabled when tab inactive)
export function useVendorOrders() {
  return useQuery({
    queryKey: queryKeys.orders.vendorOrders(),
    queryFn: () => orderService.getVendorOrders(),
    staleTime: CACHE_POLICIES.VENDOR_ORDERS.staleTime,
    gcTime: CACHE_POLICIES.VENDOR_ORDERS.gcTime,
    refetchInterval: CACHE_POLICIES.VENDOR_ORDERS.refetchInterval,
    refetchIntervalInBackground: CACHE_POLICIES.VENDOR_ORDERS.refetchIntervalInBackground,
  });
}

export function useOrderDetails(id: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => orderService.getOrderById(id),
    enabled: Boolean(id),
  });
}

// Order Mutations
export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => orderService.createOrder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.vendorOrders() });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => orderService.cancelOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.vendorOrders() });
    },
  });
}

export function useUpdateVendorOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "pending" | "accepted" | "rejected" | "cancelled" | "delivered" | "completed";
    }) => orderService.updateVendorOrderStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.vendorOrders() });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.myOrders() });
    },
  });
}

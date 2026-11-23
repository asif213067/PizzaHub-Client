import { api } from "@/lib/api-client";
import { CustomerOrder } from "@/types/order";
import { VendorOrder } from "@/types/vendor";

export interface CreateOrderPayload {
  itemId: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
}

export interface OrdersResponse<T> {
  success: boolean;
  count: number;
  data: T[];
}

export interface SingleOrderResponse<T = CustomerOrder> {
  success: boolean;
  message?: string;
  data: T;
}

export const orderService = {
  // Customer Orders
  getMyOrders: () =>
    api.get<OrdersResponse<CustomerOrder>>("/api/orders/my-orders"),

  getOrderById: (id: string) =>
    api.get<SingleOrderResponse<CustomerOrder>>(`/api/orders/${id}`),

  createOrder: (payload: CreateOrderPayload) =>
    api.post<SingleOrderResponse<CustomerOrder>>("/api/orders", payload),

  cancelOrder: (id: string) =>
    api.patch<SingleOrderResponse<CustomerOrder>>(`/api/orders/${id}/cancel`),

  // Vendor Orders
  getVendorOrders: () =>
    api.get<OrdersResponse<VendorOrder>>("/api/orders/vendor-orders"),

  updateVendorOrderStatus: (
    id: string,
    status: "pending" | "accepted" | "rejected" | "cancelled" | "delivered" | "completed"
  ) =>
    api.patch<SingleOrderResponse<VendorOrder>>(`/api/orders/${id}/status`, { status }),
};

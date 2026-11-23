/**
 * Centralized Query Keys and Cache Configuration for PizzaHub
 */

export const queryKeys = {
  // Public & Customer
  menu: {
    all: ["menu"] as const,
    lists: () => [...queryKeys.menu.all, "list"] as const,
    list: (filters: Record<string, unknown>) => [...queryKeys.menu.lists(), filters] as const,
    featured: () => [...queryKeys.menu.all, "featured"] as const,
    details: () => [...queryKeys.menu.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.menu.details(), id] as const,
    related: (id: string) => [...queryKeys.menu.all, "related", id] as const,
  },
  orders: {
    all: ["orders"] as const,
    myOrders: () => [...queryKeys.orders.all, "customer"] as const,
    vendorOrders: () => [...queryKeys.orders.all, "vendor"] as const,
    detail: (id: string) => [...queryKeys.orders.all, "detail", id] as const,
  },
  reviews: {
    all: ["reviews"] as const,
    item: (itemId: string) => [...queryKeys.reviews.all, "item", itemId] as const,
    order: (orderId: string) => [...queryKeys.reviews.all, "order", orderId] as const,
    myReviews: () => [...queryKeys.reviews.all, "customer"] as const,
    vendor: () => [...queryKeys.reviews.all, "vendor"] as const,
    admin: () => [...queryKeys.reviews.all, "admin"] as const,
  },
  user: {
    all: ["user"] as const,
    profile: () => [...queryKeys.user.all, "profile"] as const,
    adminUsers: () => [...queryKeys.user.all, "admin-list"] as const,
  },
  payment: {
    all: ["payment"] as const,
    subscriptionStatus: () => [...queryKeys.payment.all, "subscription-status"] as const,
    vendorTransactions: () => [...queryKeys.payment.all, "vendor-transactions"] as const,
    adminTransactions: () => [...queryKeys.payment.all, "admin-transactions"] as const,
  },
  admin: {
    all: ["admin"] as const,
    overview: () => [...queryKeys.admin.all, "overview"] as const,
    menuItems: (filters?: Record<string, unknown>) =>
      [...queryKeys.admin.all, "menu-items", filters || {}] as const,
  },
};

/**
 * Cache timing policies (in milliseconds)
 */
export const CACHE_POLICIES = {
  PUBLIC_MENU: {
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  },
  REVIEWS: {
    staleTime: 1 * 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000,
  },
  VENDOR_PROFILE: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000,
  },
  VENDOR_MENU: {
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 10 * 60 * 1000,
  },
  VENDOR_ORDERS: {
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000,
    refetchInterval: 60 * 1000, // Auto-refetch every 60s
    refetchIntervalInBackground: false, // Inactive tab polling disabled
  },
  ADMIN_DATA: {
    staleTime: 0, // Always fresh on entry
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false, // No continuous background polling
  },
  USER_PROFILE: {
    staleTime: 0, // Fresh on entry
    gcTime: 5 * 60 * 1000,
  },
};

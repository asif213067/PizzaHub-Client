export interface AdminOverviewStats {
  totalUsers: number;
  totalVendors: number;
  totalCustomers: number;
  totalMenuItems: number;
  pendingMenuItems: number;
  totalOrders: number;
  totalReviews?: number;
  totalTransactions: number;
  totalRevenue: number;
}

export interface AdminUser {
  _id: string;
  name: string;
  email: string;
  role: "customer" | "vendor" | "admin";
  image?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  isBlocked?: boolean;
  subscriptionPlan?: "free" | "premium";
  createdAt?: string;
}

export interface AdminMenuItem {
  _id: string;
  itemName: string;
  category: string;
  description?: string;
  price: number;
  location?: string;
  images: string[];
  status: "pending" | "approved" | "rejected" | "inactive";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  vendorId?: string;
  vendor?: {
    _id?: string;
    name?: string;
    email?: string;
    businessName?: string;
  };
}

export interface AdminTransaction {
  _id: string;
  plan: string;
  amount: number;
  currency?: string;
  stripeSessionId?: string;
  stripeSubscriptionId?: string;
  status: "succeeded" | "completed" | "paid" | "failed" | "pending";
  createdAt: string;
  vendor?: {
    _id?: string;
    name?: string;
    email?: string;
    businessName?: string;
  };
}

export interface AdminReview {
  _id: string;
  orderId?: string;
  itemId?: string;
  vendorId?: string;
  customerId?: string;
  customerName: string;
  customerImage?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  createdAt: string;
  updatedAt?: string | null;
  itemName?: string;
  itemImage?: string;
  itemCategory?: string;
  vendorName?: string;
  vendorEmail?: string;
}

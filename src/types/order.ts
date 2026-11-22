export interface OrderItem {
  _id?: string;
  itemName?: string;
  category?: string;
  price?: number;
  images?: string[];
  location?: string;
}

export interface OrderVendor {
  _id?: string;
  name?: string;
  businessName?: string;
  email?: string;
  image?: string;
}

export interface OrderReview {
  _id?: string;
  orderId?: string;
  itemId?: string;
  vendorId?: string;
  customerId?: string;
  customerName?: string;
  customerImage?: string;
  rating: number;
  comment: string;
  verifiedPurchase?: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

export interface CustomerOrder {
  _id: string;
  itemId?: string;
  vendorId?: string;
  customerId?: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  createdAt: string;
  updatedAt?: string;
  item?: OrderItem;
  vendor?: OrderVendor;
  review?: OrderReview | null;
}

export interface OrderStats {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
  cancelled: number;
}

export interface MonthlyOrderCount {
  label: string; // e.g. "Jun", "Jul", etc.
  monthIndex: number; // 0-11
  year: number;
  count: number;
}

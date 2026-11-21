export interface VendorMenuItem {
  _id: string;
  itemName: string;
  category: string;
  description?: string;
  price: number;
  location?: string;
  images?: string[];
  status?: "pending" | "approved" | "rejected" | "inactive";
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface VendorCustomer {
  _id?: string;
  name?: string;
  email?: string;
  image?: string;
  phone?: string;
}

export interface VendorOrder {
  _id: string;
  itemId?: string;
  vendorId?: string;
  customerId?: string;
  deliveryDate: string;
  deliveryAddress: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled" | "delivered" | "completed";
  createdAt: string;
  updatedAt?: string;
  item?: {
    _id?: string;
    itemName?: string;
    category?: string;
    price?: number;
    images?: string[];
  };
  customer?: VendorCustomer;
}

export interface VendorStats {
  totalItems: number;
  activeItems: number;
  pendingOrders: number;
  acceptedOrders: number;
  subscriptionPlan: "free" | "premium";
  approvedItems: number;
  pendingItems: number;
  rejectedItems: number;
  inactiveItems: number;
}

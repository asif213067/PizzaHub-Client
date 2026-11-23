import { api } from "@/lib/api-client";
import { VendorMenuItem } from "@/types/vendor";
import { AdminMenuItem } from "@/types/admin";

export interface MenuItemsQueryParams {
  search?: string;
  category?: string;
  location?: string;
  sort?: string;
  page?: number | string;
  limit?: number | string;
  featured?: boolean;
}

export interface PublicMenuItemsResponse {
  success: boolean;
  count: number;
  data: VendorMenuItem[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleMenuItemResponse {
  success: boolean;
  data: VendorMenuItem;
}

export interface AdminMenuItemsResponse {
  success: boolean;
  count: number;
  data: AdminMenuItem[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CreateMenuItemPayload {
  itemName: string;
  category: string;
  description: string;
  price: number;
  location: string;
  images: string[];
}

export interface UpdateMenuItemPayload {
  itemName?: string;
  category?: string;
  description?: string;
  price?: number;
  location?: string;
  images?: string[];
  isActive?: boolean;
}

export const menuService = {
  // Public Menu
  getPublicItems: (params: MenuItemsQueryParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.search) searchParams.set("search", params.search);
    if (params.category && params.category !== "all") searchParams.set("category", params.category);
    if (params.location && params.location !== "all") searchParams.set("location", params.location);
    if (params.sort) searchParams.set("sort", params.sort);
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.featured) searchParams.set("featured", "true");

    const query = searchParams.toString();
    return api.get<PublicMenuItemsResponse>(`/api/menu${query ? `?${query}` : ""}`);
  },

  getFeaturedItems: (limit: number = 6) =>
    api.get<PublicMenuItemsResponse>(`/api/menu?featured=true&limit=${limit}`),

  getItemById: (id: string) =>
    api.get<SingleMenuItemResponse>(`/api/menu/${id}`),

  getRelatedItems: (id: string, limit: number = 3) =>
    api.get<{ success: boolean; count: number; data: VendorMenuItem[] }>(
      `/api/menu/${id}/related?limit=${limit}`
    ),

  // Vendor Menu Management
  getVendorItems: () =>
    api.get<{ success: boolean; count: number; data: VendorMenuItem[] }>(
      "/api/menu/vendor/my-items"
    ),

  createItem: (payload: CreateMenuItemPayload) =>
    api.post<{ success: boolean; message: string; data: VendorMenuItem }>(
      "/api/menu",
      payload
    ),

  updateItem: (id: string, payload: UpdateMenuItemPayload) =>
    api.put<{ success: boolean; message: string; data: VendorMenuItem }>(
      `/api/menu/${id}`,
      payload
    ),

  deleteItem: (id: string) =>
    api.delete<{ success: boolean; message: string }>(`/api/menu/${id}`),

  // Admin Menu Governance
  getAdminAllItems: (params: {
    status?: string;
    category?: string;
    search?: string;
    page?: number | string;
    limit?: number | string;
  } = {}) => {
    const query = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 20).toString(),
      status: params.status || "all",
      category: params.category || "all",
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    }).toString();

    return api.get<AdminMenuItemsResponse>(`/api/menu/admin/all?${query}`);
  },

  updateItemStatus: (id: string, status: "approved" | "rejected" | "inactive" | "pending") =>
    api.patch<{ success: boolean; message: string; data?: AdminMenuItem }>(
      `/api/menu/${id}/status`,
      { status }
    ),
};

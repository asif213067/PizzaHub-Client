import { api } from "@/lib/api-client";
import { AdminUser } from "@/types/admin";

export interface UpdateUserProfilePayload {
  name?: string;
  phone?: string;
  address?: string;
  businessName?: string;
  image?: string;
}

export interface UserProfileResponse {
  success: boolean;
  data: AdminUser;
}

export interface AdminUsersResponse {
  success: boolean;
  count: number;
  data: AdminUser[];
}

export const userService = {
  // Authenticated user profile
  getProfile: () =>
    api.get<UserProfileResponse>("/api/users/profile"),

  updateProfile: (payload: UpdateUserProfilePayload) =>
    api.patch<{ success: boolean; message: string; data: AdminUser }>(
      "/api/users/profile",
      payload
    ),

  // Admin user governance
  getAdminUsers: (params: { page?: number | string; limit?: number | string; role?: string; search?: string } = {}) => {
    const query = new URLSearchParams({
      page: (params.page || 1).toString(),
      limit: (params.limit || 15).toString(),
      role: params.role || "all",
      ...(params.search?.trim() ? { search: params.search.trim() } : {}),
    }).toString();
    return api.get<AdminUsersResponse & { pagination?: { total: number; totalPages: number } }>(
      `/api/admin/users?${query}`
    );
  },

  toggleBlockUser: (id: string) =>
    api.patch<{ success: boolean; message: string; data: AdminUser }>(
      `/api/admin/users/${id}/block`
    ),
};

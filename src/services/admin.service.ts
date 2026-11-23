import { api } from "@/lib/api-client";
import { AdminOverviewStats, AdminTransaction } from "@/types/admin";

export const adminService = {
  getOverviewStats: () =>
    api.get<{ success: boolean; data: AdminOverviewStats }>("/api/admin/overview"),

  getTransactions: () =>
    api.get<{ success: boolean; count: number; data: AdminTransaction[] }>(
      "/api/admin/transactions"
    ),
};

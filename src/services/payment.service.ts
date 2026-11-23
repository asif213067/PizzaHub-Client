import { api } from "@/lib/api-client";
import { AdminTransaction } from "@/types/admin";

export interface SubscriptionStatus {
  subscriptionPlan: "free" | "premium";
  isPremium: boolean;
  subscriptionExpiresAt: string | null;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  isManualOverride?: boolean;
}

export interface CreateCheckoutSessionPayload {
  plan: "monthly" | "yearly";
}

export const paymentService = {
  getSubscriptionStatus: () =>
    api.get<{ success: boolean; data: SubscriptionStatus }>("/api/payments/subscription-status"),

  createCheckoutSession: (payload: CreateCheckoutSessionPayload) =>
    api.post<{ success: boolean; url: string }>("/api/payments/create-checkout-session", payload),

  cancelSubscription: () =>
    api.post<{ success: boolean; message: string }>("/api/payments/cancel-subscription"),

  getVendorTransactions: () =>
    api.get<{ success: boolean; count: number; data: AdminTransaction[] }>(
      "/api/payments/transactions"
    ),
};

"use client";

import { useState, useEffect, useMemo } from "react";
import { ShoppingBag, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  VendorOrdersFilters,
  OrderStatusFilter,
} from "@/components/dashboard/vendor/vendor-orders-filters";
import { VendorOrderCard } from "@/components/dashboard/vendor/vendor-order-card";
import { VendorItemsPagination } from "@/components/dashboard/vendor/vendor-items-pagination";
import { syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { VendorOrder } from "@/types/vendor";
import { useVendorOrders, useUpdateVendorOrderStatus } from "@/hooks/queries";

const PAGE_SIZE = 4;

export default function VendorOrdersPage() {
  const { data: session } = useSession();
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Sync auth token on session change
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  // TanStack Query: auto-refreshes every 60s, pauses in inactive tabs, caches results
  const { data: ordersRes, isLoading: loading } = useVendorOrders();
  const updateStatusMutation = useUpdateVendorOrderStatus();

  const orders = useMemo(() => {
    return Array.isArray(ordersRes?.data) ? ordersRes.data : [];
  }, [ordersRes]);

  // Compute status counts for filter pills
  const counts = useMemo(() => {
    let pending = 0;
    let accepted = 0;
    let rejected = 0;
    let cancelled = 0;

    orders.forEach((ord) => {
      if (ord.status === "pending") pending++;
      else if (ord.status === "accepted") accepted++;
      else if (ord.status === "rejected") rejected++;
      else if (ord.status === "cancelled") cancelled++;
    });

    return {
      all: orders.length,
      pending,
      accepted,
      rejected,
      cancelled,
    };
  }, [orders]);

  // Filter orders by selected status
  const filteredOrders = useMemo(() => {
    if (statusFilter === "all") return orders;
    return orders.filter((o) => o.status === statusFilter);
  }, [orders, statusFilter]);

  // Handle filter change
  const handleFilterChange = (filter: OrderStatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  // Accept or Reject order action
  const handleUpdateStatus = async (
    order: VendorOrder,
    nextStatus: "accepted" | "rejected"
  ) => {
    try {
      setUpdatingId(order._id);
      await updateStatusMutation.mutateAsync({
        id: order._id,
        status: nextStatus,
      });

      toast.success(
        nextStatus === "accepted"
          ? `Order for ${order.customer?.name || "Customer"} accepted!`
          : `Order for ${order.customer?.name || "Customer"} rejected.`
      );
    } catch {
      toast.error("Could not update order status. Please try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Customer Orders"
        subtitle="Accept or reject incoming orders."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl w-full mx-auto space-y-5">
        {/* Status Filter Pills */}
        <VendorOrdersFilters
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />

        {/* Orders List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs animate-pulse flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-full bg-muted/60" />
                    <div className="space-y-2 flex-1">
                      <div className="w-24 h-4 bg-muted/60 rounded" />
                      <div className="w-32 h-3 bg-muted/40 rounded" />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-11 rounded-2xl bg-muted/60" />
                    <div className="space-y-2 flex-1">
                      <div className="w-24 h-4 bg-muted/60 rounded" />
                      <div className="w-16 h-3 bg-muted/40 rounded" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-20 h-3 bg-muted/40 rounded" />
                    <div className="w-24 h-4 bg-muted/60 rounded" />
                  </div>
                  <div className="space-y-2">
                    <div className="w-24 h-3 bg-muted/40 rounded" />
                    <div className="w-36 h-4 bg-muted/60 rounded" />
                  </div>
                </div>
                <div className="w-full h-7 bg-muted/30 rounded mt-1" />
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              {statusFilter === "all" ? (
                <ShoppingBag className="size-8" />
              ) : (
                <AlertCircle className="size-8" />
              )}
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {statusFilter === "all"
                ? "No customer orders yet"
                : `No ${statusFilter} orders found`}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
              {statusFilter === "all"
                ? "When customers place orders for your pizzas, they will appear here in real time."
                : `There are currently no orders in the ${statusFilter} status.`}
            </p>
            {statusFilter !== "all" && (
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Show All Orders
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedOrders.map((order) => (
              <VendorOrderCard
                key={order._id}
                order={order}
                onAccept={(ord) => handleUpdateStatus(ord, "accepted")}
                onReject={(ord) => handleUpdateStatus(ord, "rejected")}
                isUpdating={updatingId === order._id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredOrders.length > 0 && (
          <VendorItemsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredOrders.length}
            pageSize={PAGE_SIZE}
            itemLabel="orders"
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>
    </div>
  );
}

"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Pizza, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { api, getStoredToken, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import {
  OrderStatusFilters,
  OrderStatusFilter,
} from "@/components/dashboard/orders/order-status-filters";
import { CustomerOrderCard } from "@/components/dashboard/orders/customer-order-card";
import { OrderDetailsModal } from "@/components/dashboard/orders/order-details-modal";
import { CancelOrderModal } from "@/components/dashboard/orders/cancel-order-modal";
import { ReviewOrderModal } from "@/components/dashboard/orders/review-order-modal";
import { OrderPagination } from "@/components/dashboard/orders/order-pagination";
import { CustomerOrder, OrderReview } from "@/types/order";

const PAGE_SIZE = 4;

export default function CustomerOrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<OrderStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Modals state
  const [viewingOrder, setViewingOrder] = useState<CustomerOrder | null>(null);
  const [cancellingOrder, setCancellingOrder] = useState<CustomerOrder | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [reviewingOrder, setReviewingOrder] = useState<CustomerOrder | null>(null);

  function handleReviewSuccess(orderId: string, review: OrderReview) {
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, review } : o))
    );
    if (viewingOrder?._id === orderId) {
      setViewingOrder((prev) => (prev ? { ...prev, review } : null));
    }
  }

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        // Ensure token is synced if missing from localStorage
        if (!getStoredToken() && session?.user?.email) {
          await syncAuthToken(session.user.email);
        }

        const res = await api.get<{ success: boolean; data: CustomerOrder[] }>(
          "/api/orders/my-orders"
        );

        if (isMounted && res?.data) {
          setOrders(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Failed to load customer orders:", err);
        toast.error("Could not load your orders. Please try again.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  // Status counts for filter pills
  const statusCounts = useMemo(() => {
    return {
      all: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  // Filtered orders
  const filteredOrders = useMemo(() => {
    if (activeFilter === "all") return orders;
    return orders.filter((o) => o.status === activeFilter);
  }, [orders, activeFilter]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE));
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredOrders.slice(start, start + PAGE_SIZE);
  }, [filteredOrders, currentPage]);

  function handleFilterChange(filter: OrderStatusFilter) {
    setActiveFilter(filter);
    setCurrentPage(1);
  }

  // Handle Order Cancellation
  async function handleConfirmCancel(order: CustomerOrder) {
    try {
      setIsCancelling(true);

      const res = await api.patch<{ success: boolean; message?: string }>(
        `/api/orders/${order._id}/cancel`
      );

      if (res?.success) {
        toast.success("Order cancelled successfully");

        // Update local order status
        setOrders((prev) =>
          prev.map((o) =>
            o._id === order._id ? { ...o, status: "cancelled" } : o
          )
        );

        // Update viewingOrder if open
        if (viewingOrder?._id === order._id) {
          setViewingOrder((prev) =>
            prev ? { ...prev, status: "cancelled" } : null
          );
        }

        setCancellingOrder(null);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to cancel order.";
      toast.error(msg);
    } finally {
      setIsCancelling(false);
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        title="My Orders"
        subtitle="View, track, and cancel your pending orders."
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-5 max-w-7xl">
        {/* Filter Pills */}
        <OrderStatusFilters
          activeFilter={activeFilter}
          onFilterChange={handleFilterChange}
          counts={statusCounts}
        />

        {/* Orders List / Loading Skeletons / Empty States */}
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-2xl bg-muted/60 shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="w-48 h-4 bg-muted/60 rounded" />
                    <div className="w-32 h-3 bg-muted/50 rounded" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <div className="w-24 h-6 bg-muted/60 rounded-full" />
                  <div className="flex gap-2">
                    <div className="w-20 h-6 bg-muted/60 rounded-full" />
                    <div className="w-16 h-6 bg-muted/60 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center my-4">
            <div className="size-14 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center mb-3.5">
              <Pizza className="size-7" />
            </div>

            {orders.length === 0 ? (
              <>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  No orders placed yet
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
                  You haven&apos;t ordered any pizzas yet. Explore our handcrafted
                  menu to place your first order!
                </p>
                <Link
                  href="/menu"
                  className="mt-5 inline-flex items-center gap-2 text-xs sm:text-sm font-semibold px-6 py-2.5 rounded-full bg-[#c22d2f] text-white hover:bg-[#a82527] transition-all shadow-md active:scale-95"
                >
                  Browse Menu <ArrowRight className="size-4" />
                </Link>
              </>
            ) : (
              <>
                <h3 className="font-heading text-lg font-bold text-foreground">
                  No {activeFilter} orders
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
                  You do not have any orders matching the &ldquo;{activeFilter}&rdquo; status.
                </p>
                <button
                  type="button"
                  onClick={() => handleFilterChange("all")}
                  className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold px-5 py-2 rounded-full border border-border text-foreground hover:bg-muted transition-colors cursor-pointer"
                >
                  View All Orders
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {paginatedOrders.map((order) => (
              <CustomerOrderCard
                key={order._id}
                order={order}
                onViewDetails={(selected) => setViewingOrder(selected)}
                onCancel={(selected) => setCancellingOrder(selected)}
                onReview={(selected) => setReviewingOrder(selected)}
              />
            ))}

            {/* Pagination */}
            <OrderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalOrders={filteredOrders.length}
              pageSize={PAGE_SIZE}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
        )}
      </main>

      {/* Order Details Modal */}
      <OrderDetailsModal
        order={viewingOrder}
        isOpen={Boolean(viewingOrder)}
        onClose={() => setViewingOrder(null)}
        onCancelRequest={(order) => setCancellingOrder(order)}
      />

      {/* Cancel Order Confirmation Modal */}
      <CancelOrderModal
        order={cancellingOrder}
        isOpen={Boolean(cancellingOrder)}
        isCancelling={isCancelling}
        onClose={() => setCancellingOrder(null)}
        onConfirmCancel={handleConfirmCancel}
      />

      {/* Review Order Modal */}
      <ReviewOrderModal
        order={reviewingOrder}
        isOpen={Boolean(reviewingOrder)}
        onClose={() => setReviewingOrder(null)}
        onSuccess={handleReviewSuccess}
      />
    </div>
  );
}

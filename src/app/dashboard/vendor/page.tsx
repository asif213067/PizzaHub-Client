"use client";

import { useEffect, useState, useMemo } from "react";
import { api, getStoredToken, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VendorTierBanner } from "@/components/dashboard/vendor/vendor-tier-banner";
import { VendorStatCards } from "@/components/dashboard/vendor/vendor-stat-cards";
import { VendorMenuStatusChart } from "@/components/dashboard/vendor/vendor-menu-status-chart";
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart";
import { VendorRecentOrders } from "@/components/dashboard/vendor/vendor-recent-orders";
import { VendorMenuItem, VendorOrder, VendorStats } from "@/types/vendor";
import { MonthlyOrderCount } from "@/types/order";

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function VendorOverviewPage() {
  const { data: session } = useSession();
  const [menuItems, setMenuItems] = useState<VendorMenuItem[]>([]);
  const [orders, setOrders] = useState<VendorOrder[]>([]);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [monthlyData, setMonthlyData] = useState<MonthlyOrderCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchVendorOverviewData() {
      try {
        setLoading(true);

        // Ensure token is synced if missing from localStorage
        if (!getStoredToken() && session?.user?.email) {
          await syncAuthToken(session.user.email);
        }

        const [itemsRes, ordersRes, profileRes] = await Promise.all([
          api
            .get<{ success: boolean; data: VendorMenuItem[] }>(
              "/api/menu/vendor/my-items"
            )
            .catch(() => ({ success: false, data: [] })),
          api
            .get<{ success: boolean; data: VendorOrder[] }>(
              "/api/orders/vendor-orders"
            )
            .catch(() => ({ success: false, data: [] })),
          api
            .get<{ success: boolean; data: { subscriptionPlan?: string } }>(
              "/api/users/profile"
            )
            .catch(() => ({ success: false, data: { subscriptionPlan: "free" } })),
        ]);

        if (isMounted) {
          const itemsList = Array.isArray(itemsRes?.data) ? itemsRes.data : [];
          const ordersList = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
          const vendorPlan =
            profileRes?.data?.subscriptionPlan === "premium" ? "premium" : "free";

          setMenuItems(itemsList);
          setOrders(ordersList);
          setPlan(vendorPlan);

          // Compute 6-month historical activity from real order data
          const today = new Date();
          const months: MonthlyOrderCount[] = [];

          for (let i = 5; i >= 0; i--) {
            const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
            months.push({
              label: MONTH_NAMES[d.getMonth()],
              monthIndex: d.getMonth(),
              year: d.getFullYear(),
              count: 0,
            });
          }

          ordersList.forEach((order) => {
            if (!order.createdAt) return;
            const orderDate = new Date(order.createdAt);
            if (isNaN(orderDate.getTime())) return;

            const orderMonth = orderDate.getMonth();
            const orderYear = orderDate.getFullYear();

            const matchedMonth = months.find(
              (m) => m.monthIndex === orderMonth && m.year === orderYear
            );
            if (matchedMonth) {
              matchedMonth.count += 1;
            }
          });

          setMonthlyData(months);
        }
      } catch (err) {
        console.error("Failed to load vendor overview data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchVendorOverviewData();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  // Aggregate stats from real items and orders data
  const stats: VendorStats = useMemo(() => {
    const totalItems = menuItems.length;
    const activeItems = menuItems.filter(
      (i) => i.isActive !== false && i.status === "approved"
    ).length;
    const pendingOrders = orders.filter((o) => o.status === "pending").length;
    const acceptedOrders = orders.filter((o) => o.status === "accepted").length;

    // Status breakdown for doughnut chart
    const approvedItems = menuItems.filter(
      (i) => i.status === "approved" && i.isActive !== false
    ).length;
    const pendingItems = menuItems.filter((i) => i.status === "pending").length;
    const rejectedItems = menuItems.filter((i) => i.status === "rejected").length;
    const inactiveItems = menuItems.filter((i) => i.isActive === false).length;

    return {
      totalItems,
      activeItems,
      pendingOrders,
      acceptedOrders,
      subscriptionPlan: plan,
      approvedItems,
      pendingItems,
      rejectedItems,
      inactiveItems,
    };
  }, [menuItems, orders, plan]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        title="Overview"
        subtitle="Your restaurant at a glance."
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-5 sm:gap-6 max-w-7xl">
        {/* Tier / Plan Banner */}
        <VendorTierBanner
          plan={stats.subscriptionPlan}
          activeItems={stats.activeItems}
          loading={loading}
        />

        {/* 5 Stat Cards */}
        <VendorStatCards stats={stats} loading={loading} />

        {/* 2 Charts Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <VendorMenuStatusChart stats={stats} loading={loading} />
          <MonthlyBarChart
            monthlyData={monthlyData}
            loading={loading}
            title="Customer orders, last 6 months"
          />
        </div>

        {/* Recent Customer Orders Section */}
        <VendorRecentOrders orders={orders} loading={loading} />
      </main>
    </div>
  );
}

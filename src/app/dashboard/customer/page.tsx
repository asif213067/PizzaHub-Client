"use client";

import { useEffect, useState, useMemo } from "react";
import { api, getStoredToken, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { WelcomeBanner } from "@/components/dashboard/welcome-banner";
import { StatCards } from "@/components/dashboard/stat-cards";
import { StatusDoughnutChart } from "@/components/dashboard/status-doughnut-chart";
import { MonthlyBarChart } from "@/components/dashboard/monthly-bar-chart";
import { RecentOrders } from "@/components/dashboard/recent-orders";
import { CustomerOrder, OrderStats, MonthlyOrderCount } from "@/types/order";

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

export default function CustomerDashboardPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyOrderCount[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchOrders() {
      try {
        setLoading(true);

        // Ensure token is synced if missing from localStorage
        if (!getStoredToken() && session?.user?.email) {
          await syncAuthToken(session.user.email);
        }

        const res = await api.get<{ success: boolean; data: CustomerOrder[] }>(
          "/api/orders/my-orders"
        );

        if (isMounted) {
          const ordersList = Array.isArray(res?.data) ? res.data : [];
          setOrders(ordersList);

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
        console.error("Failed to load customer orders:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [session?.user?.email]);

  // Aggregate stats from real order data
  const stats: OrderStats = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((o) => o.status === "pending").length,
      accepted: orders.filter((o) => o.status === "accepted").length,
      rejected: orders.filter((o) => o.status === "rejected").length,
      cancelled: orders.filter((o) => o.status === "cancelled").length,
    };
  }, [orders]);

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Header */}
      <DashboardHeader
        title="Overview"
        subtitle="Your orders at a glance."
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-8 flex flex-col gap-5 sm:gap-6 max-w-7xl">
        {/* Welcome Banner */}
        <WelcomeBanner />

        {/* 4 Summary Stat Cards */}
        <StatCards stats={stats} loading={loading} />

        {/* 2 Charts Side-by-Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
          <StatusDoughnutChart stats={stats} loading={loading} />
          <MonthlyBarChart monthlyData={monthlyData} loading={loading} />
        </div>

        {/* Recent Orders Section */}
        <RecentOrders orders={orders} loading={loading} />
      </main>
    </div>
  );
}

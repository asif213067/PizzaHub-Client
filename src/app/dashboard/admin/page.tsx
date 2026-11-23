"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Users,
  UtensilsCrossed,
  DollarSign,
  LayoutDashboard,
  RefreshCw,
  AlertTriangle,
  Building2,
  CheckCircle2,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AdminStatCards } from "@/components/dashboard/admin/admin-stat-cards";
import { AdminUserTable } from "@/components/dashboard/admin/admin-user-table";
import { AdminMenuApproval } from "@/components/dashboard/admin/admin-menu-approval";
import { AdminTransactionsTable } from "@/components/dashboard/admin/admin-transactions-table";
import { AdminReviewTable } from "@/components/dashboard/admin/admin-review-table";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { adminService } from "@/services/admin.service";
import { menuService } from "@/services/menu.service";
import { userService } from "@/services/user.service";
import { reviewService } from "@/services/review.service";
import {
  AdminOverviewStats,
  AdminUser,
  AdminMenuItem,
  AdminTransaction,
  AdminReview,
} from "@/types/admin";

export default function AdminDashboardPage() {
  const { data: session } = useSession();

  // Tab State: "overview" | "users" | "items" | "transactions" | "reviews"
  const [activeTab, setActiveTab] = useState<"overview" | "users" | "items" | "transactions" | "reviews">("overview");

  // Overview Stats
  const [stats, setStats] = useState<AdminOverviewStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Users Management State
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  // Menu Items Approval State
  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemPage, setItemPage] = useState(1);
  const [itemTotalPages, setItemTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [itemSearch, setItemSearch] = useState("");
  const [itemStatusFilter, setItemStatusFilter] = useState("all");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("all");

  // Transactions State
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [txLoading, setTxLoading] = useState(true);
  const [txTotalCount, setTxTotalCount] = useState(0);

  // Reviews State
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [reviewTotalPages, setReviewTotalPages] = useState(1);
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);
  const [reviewSearch, setReviewSearch] = useState("");
  const [reviewRatingFilter, setReviewRatingFilter] = useState("all");

  // Sync auth token
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  // Fetch Overview Stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await adminService.getOverviewStats();
      if (res?.data) {
        setStats(res.data);
      }
    } catch {
      // silently handle
    } finally {
      setStatsLoading(false);
    }
  }, []);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const res = await userService.getAdminUsers({
        page: userPage,
        limit: 10,
        role: userRoleFilter,
        search: userSearch,
      });

      if (res?.data) {
        setUsers(res.data);
        setUserTotalPages(res.pagination?.totalPages || 1);
        setTotalUsersCount(res.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load users list.");
    } finally {
      setUsersLoading(false);
    }
  }, [userPage, userRoleFilter, userSearch]);

  // Fetch Menu Items
  const fetchMenuItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      const res = await menuService.getAdminAllItems({
        page: itemPage,
        limit: 8,
        status: itemStatusFilter,
        category: itemCategoryFilter,
        search: itemSearch,
      });

      if (res?.data) {
        setMenuItems(res.data);
        setItemTotalPages(res.pagination?.totalPages || 1);
        setTotalItemsCount(res.pagination?.total || 0);
      }
    } catch {
      toast.error("Failed to load menu items.");
    } finally {
      setItemsLoading(false);
    }
  }, [itemPage, itemStatusFilter, itemCategoryFilter, itemSearch]);

  // Fetch Transactions
  const fetchTransactions = useCallback(async () => {
    try {
      const res = await adminService.getTransactions();

      if (res?.data) {
        setTransactions(res.data);
        setTxTotalCount(res.count || res.data.length);
      }
    } catch {
      // silently handle
    } finally {
      setTxLoading(false);
    }
  }, []);

  // Fetch Reviews
  const fetchReviews = useCallback(async () => {
    setReviewsLoading(true);
    try {
      const res = await reviewService.getAllReviewsAdmin({
        page: reviewPage,
        limit: 10,
        rating: reviewRatingFilter,
        search: reviewSearch,
      });

      if (res?.data) {
        setReviews(res.data);
        setReviewTotalPages(res.pagination?.totalPages || 1);
        setTotalReviewsCount(res.pagination?.total || 0);
      }
    } catch {
      // silently handle
    } finally {
      setReviewsLoading(false);
    }
  }, [reviewPage, reviewRatingFilter, reviewSearch]);

  // Initial Load
  useEffect(() => {
    fetchStats();
    fetchUsers();
    fetchMenuItems();
    fetchTransactions();
    fetchReviews();
  }, [fetchStats, fetchUsers, fetchMenuItems, fetchTransactions, fetchReviews]);

  // Callback when an item status changes
  function handleItemUpdated() {
    fetchMenuItems();
    fetchStats();
  }

  // Callback when user block status changes
  function handleUserUpdated() {
    fetchUsers();
    fetchStats();
  }

  // Refresh all
  function handleRefreshAll() {
    fetchStats();
    fetchUsers();
    fetchMenuItems();
    fetchTransactions();
    fetchReviews();
    toast.success("Dashboard data refreshed!");
  }

  const pendingItems = menuItems.filter((m) => m.status === "pending");

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Admin Control Center"
        subtitle="Platform oversight, user moderation, and menu approval queue."
        action={
          <button
            type="button"
            onClick={handleRefreshAll}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full bg-white dark:bg-card border border-stone-200/80 dark:border-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/80 transition-colors shadow-2xs cursor-pointer"
          >
            <RefreshCw className="size-3" />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        }
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6">
        {/* Stat Cards */}
        <AdminStatCards stats={stats} loading={statsLoading} />

        {/* Tab Selector */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-stone-200/70 dark:border-stone-800">
          {[
            { id: "overview", label: "Overview", icon: LayoutDashboard },
            { id: "users", label: `Users & Vendors (${totalUsersCount})`, icon: Users },
            {
              id: "items",
              label: `Menu Approvals ${stats?.pendingMenuItems ? `(${stats.pendingMenuItems})` : ""}`,
              icon: UtensilsCrossed,
              highlight: (stats?.pendingMenuItems ?? 0) > 0,
            },
            { id: "reviews", label: `Reviews (${totalReviewsCount || stats?.totalReviews || 0})`, icon: Star },
            { id: "transactions", label: "Financials & Revenue", icon: DollarSign },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#c22d2f] text-white shadow-xs"
                    : "bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800"
                }`}
              >
                <Icon className="size-3.5" />
                <span>{tab.label}</span>
                {tab.highlight && !isActive && (
                  <span className="size-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: OVERVIEW ────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Urgent Review Alert Banner if pending items exist */}
            {(stats?.pendingMenuItems ?? 0) > 0 && (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 sm:p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-3xl">
                <div className="flex items-start gap-3">
                  <div className="size-10 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-sm text-foreground">
                      {stats?.pendingMenuItems} Menu Item{stats?.pendingMenuItems === 1 ? "" : "s"} Awaiting Approval
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Vendors cannot publish pizzas to the public menu without administrator verification.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab("items");
                    setItemStatusFilter("pending");
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-[#c22d2f] hover:bg-[#a82527] text-white shadow-xs cursor-pointer whitespace-nowrap"
                >
                  Review Pending Queue
                </button>
              </div>
            )}

            {/* Quick Menu Review Section */}
            <AdminMenuApproval
              items={pendingItems.length > 0 ? pendingItems : menuItems.slice(0, 4)}
              totalItems={pendingItems.length > 0 ? pendingItems.length : totalItemsCount}
              currentPage={itemPage}
              totalPages={itemTotalPages}
              loading={itemsLoading}
              onPageChange={setItemPage}
              onSearchChange={setItemSearch}
              onStatusFilterChange={setItemStatusFilter}
              onCategoryFilterChange={setItemCategoryFilter}
              selectedStatus={itemStatusFilter}
              selectedCategory={itemCategoryFilter}
              searchQuery={itemSearch}
              onItemStatusUpdated={handleItemUpdated}
            />

            {/* Recent Users Table */}
            <AdminUserTable
              users={users.slice(0, 5)}
              totalUsers={totalUsersCount}
              currentPage={userPage}
              totalPages={userTotalPages}
              loading={usersLoading}
              onPageChange={setUserPage}
              onSearchChange={setUserSearch}
              onRoleChange={setUserRoleFilter}
              selectedRole={userRoleFilter}
              searchQuery={userSearch}
              currentAdminEmail={session?.user?.email ?? undefined}
              onUserStatusUpdated={handleUserUpdated}
            />
          </div>
        )}

        {/* ── TAB 2: USERS & VENDORS ─────────────────────────────────── */}
        {activeTab === "users" && (
          <AdminUserTable
            users={users}
            totalUsers={totalUsersCount}
            currentPage={userPage}
            totalPages={userTotalPages}
            loading={usersLoading}
            onPageChange={setUserPage}
            onSearchChange={(q) => {
              setUserSearch(q);
              setUserPage(1);
            }}
            onRoleChange={(r) => {
              setUserRoleFilter(r);
              setUserPage(1);
            }}
            selectedRole={userRoleFilter}
            searchQuery={userSearch}
            currentAdminEmail={session?.user?.email ?? undefined}
            onUserStatusUpdated={handleUserUpdated}
          />
        )}

        {/* ── TAB 3: MENU APPROVALS ──────────────────────────────────── */}
        {activeTab === "items" && (
          <AdminMenuApproval
            items={menuItems}
            totalItems={totalItemsCount}
            currentPage={itemPage}
            totalPages={itemTotalPages}
            loading={itemsLoading}
            onPageChange={setItemPage}
            onSearchChange={(q) => {
              setItemSearch(q);
              setItemPage(1);
            }}
            onStatusFilterChange={(s) => {
              setItemStatusFilter(s);
              setItemPage(1);
            }}
            onCategoryFilterChange={(c) => {
              setItemCategoryFilter(c);
              setItemPage(1);
            }}
            selectedStatus={itemStatusFilter}
            selectedCategory={itemCategoryFilter}
            searchQuery={itemSearch}
            onItemStatusUpdated={handleItemUpdated}
          />
        )}

        {/* ── TAB 4: FINANCIALS & TRANSACTIONS ────────────────────────── */}
        {activeTab === "transactions" && (
          <AdminTransactionsTable
            transactions={transactions}
            totalCount={txTotalCount}
            loading={txLoading}
          />
        )}

        {/* ── TAB 5: REVIEWS MANAGEMENT ───────────────────────────────── */}
        {activeTab === "reviews" && (
          <AdminReviewTable
            reviews={reviews}
            totalReviews={totalReviewsCount}
            currentPage={reviewPage}
            totalPages={reviewTotalPages}
            loading={reviewsLoading}
            onPageChange={setReviewPage}
            onSearchChange={(q) => {
              setReviewSearch(q);
              setReviewPage(1);
            }}
            onRatingFilterChange={(r) => {
              setReviewRatingFilter(r);
              setReviewPage(1);
            }}
            selectedRating={reviewRatingFilter}
            searchQuery={reviewSearch}
            onReviewDeleted={() => {
              fetchReviews();
              fetchStats();
            }}
          />
        )}
      </main>
    </div>
  );
}

"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Plus, Pizza, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { VendorCompactTierBanner } from "@/components/dashboard/vendor/vendor-compact-tier-banner";
import {
  VendorItemsFilters,
  MenuItemStatusFilter,
} from "@/components/dashboard/vendor/vendor-items-filters";
import { VendorMenuItemCard } from "@/components/dashboard/vendor/vendor-menu-item-card";
import { VendorItemsPagination } from "@/components/dashboard/vendor/vendor-items-pagination";
import { VendorViewItemModal } from "@/components/dashboard/vendor/vendor-view-item-modal";
import { VendorEditItemModal } from "@/components/dashboard/vendor/vendor-edit-item-modal";
import { VendorDeleteItemModal } from "@/components/dashboard/vendor/vendor-delete-item-modal";
import { VendorUpgradeLimitModal } from "@/components/dashboard/vendor/vendor-upgrade-limit-modal";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { VendorMenuItem } from "@/types/vendor";

const PAGE_SIZE = 4;

interface MenuItemsApiResponse {
  success?: boolean;
  data?: VendorMenuItem[];
}

interface ProfileApiResponse {
  success?: boolean;
  data?: {
    subscriptionPlan?: "free" | "premium";
  };
}

interface SingleItemApiResponse {
  success?: boolean;
  data?: VendorMenuItem;
}

export default function VendorItemsPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<VendorMenuItem[]>([]);
  const [plan, setPlan] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<MenuItemStatusFilter>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Modals state
  const [viewingItem, setViewingItem] = useState<VendorMenuItem | null>(null);
  const [editingItem, setEditingItem] = useState<VendorMenuItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<VendorMenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  // Sync auth token on session change
  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  // Fetch vendor items and profile on mount
  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        const [itemsRes, profileRes] = await Promise.allSettled([
          api.get<MenuItemsApiResponse>("/api/menu/vendor/my-items"),
          api.get<ProfileApiResponse>("/api/users/profile"),
        ]);

        if (!isMounted) return;

        if (itemsRes.status === "fulfilled" && itemsRes.value) {
          const rawItems = itemsRes.value.data || [];
          setItems(Array.isArray(rawItems) ? rawItems : []);
        }

        if (profileRes.status === "fulfilled" && profileRes.value) {
          const profileData = profileRes.value.data || {};
          if (profileData.subscriptionPlan === "premium") {
            setPlan("premium");
          } else {
            setPlan("free");
          }
        }
      } catch {
        if (isMounted) {
          toast.error("Failed to load your menu items. Please refresh.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Calculate counts and active items
  const { counts, activeItemsCount } = useMemo(() => {
    let approved = 0;
    let pending = 0;
    let rejected = 0;
    let inactive = 0;

    items.forEach((item) => {
      const isItemInactive =
        item.isActive === false || item.status === "inactive";
      if (isItemInactive) {
        inactive++;
      } else if (item.status === "approved") {
        approved++;
      } else if (item.status === "pending") {
        pending++;
      } else if (item.status === "rejected") {
        rejected++;
      }
    });

    const activeCount = approved; // active items visible to customers

    return {
      activeItemsCount: activeCount,
      counts: {
        all: items.length,
        approved,
        pending,
        rejected,
        inactive,
      },
    };
  }, [items]);

  // Filter items
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isItemInactive =
        item.isActive === false || item.status === "inactive";
      if (statusFilter === "all") return true;
      if (statusFilter === "inactive") return isItemInactive;
      if (statusFilter === "approved")
        return !isItemInactive && item.status === "approved";
      if (statusFilter === "pending")
        return !isItemInactive && item.status === "pending";
      if (statusFilter === "rejected")
        return !isItemInactive && item.status === "rejected";
      return true;
    });
  }, [items, statusFilter]);

  // Reset page when filter changes
  const handleFilterChange = (filter: MenuItemStatusFilter) => {
    setStatusFilter(filter);
    setCurrentPage(1);
  };

  // Pagination calculation
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE) || 1;
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredItems.slice(start, start + PAGE_SIZE);
  }, [filteredItems, currentPage]);

  // Toggle active switch
  const handleToggleActive = async (item: VendorMenuItem) => {
    const rawStatus = (item.status || "").toLowerCase();
    if (rawStatus === "pending") {
      toast.error("This item is pending approval and cannot be made available yet.");
      return;
    }
    if (rawStatus === "rejected") {
      toast.error("This item was rejected and cannot be made available to customers.");
      return;
    }

    const isCurrentlyActive =
      item.isActive !== false && (rawStatus === "approved" || rawStatus === "accepted");
    const willActivate = !isCurrentlyActive;

    // Free tier enforcement: max 3 active items
    if (willActivate && plan === "free" && activeItemsCount >= 3) {
      setUpgradeModalOpen(true);
      return;
    }

    try {
      setTogglingId(item._id);

      const nextActiveState = willActivate;
      const res = await api.put<SingleItemApiResponse>(
        `/api/menu/${item._id}`,
        { isActive: nextActiveState }
      );

      const updated = res?.data;
      if (updated && updated._id) {
        setItems((prev) =>
          prev.map((i) => (i._id === item._id ? { ...i, ...updated } : i))
        );
      } else {
        // Fallback local update
        setItems((prev) =>
          prev.map((i) =>
            i._id === item._id
              ? {
                  ...i,
                  isActive: nextActiveState,
                  status: (nextActiveState ? "approved" : "inactive") as
                    | "approved"
                    | "inactive",
                }
              : i
          )
        );
      }

      toast.success(
        nextActiveState
          ? `"${item.itemName}" is now available to customers.`
          : `"${item.itemName}" is now inactive and hidden.`
      );
    } catch (err: unknown) {
      const msg =
        err instanceof Error
          ? err.message
          : "Failed to update item availability. Please try again.";
      toast.error(msg);
    } finally {
      setTogglingId(null);
    }
  };

  // Callback when item is edited in modal
  const handleItemUpdated = (updatedItem: VendorMenuItem) => {
    setItems((prev) =>
      prev.map((i) => (i._id === updatedItem._id ? updatedItem : i))
    );
  };

  // Confirm delete item
  const handleConfirmDelete = async (item: VendorMenuItem) => {
    try {
      setIsDeleting(true);

      await api.delete(`/api/menu/${item._id}`);
      setItems((prev) => prev.filter((i) => i._id !== item._id));
      toast.success(`"${item.itemName}" has been deleted.`);
      setDeletingItem(null);
    } catch {
      toast.error("Failed to delete menu item. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="My Menu Items"
        subtitle="Manage your pizzas, sides, and drinks."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-10 max-w-7xl w-full mx-auto space-y-5">
        {/* Compact Tier Banner */}
        <VendorCompactTierBanner
          plan={plan}
          activeCount={activeItemsCount}
          loading={loading}
        />

        {/* Filter Pills */}
        <VendorItemsFilters
          activeFilter={statusFilter}
          onFilterChange={handleFilterChange}
          counts={counts}
        />

        {/* Menu Items List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs animate-pulse flex flex-col gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-2xl bg-muted/60" />
                  <div className="space-y-2 flex-1">
                    <div className="w-48 h-5 bg-muted/60 rounded" />
                    <div className="w-24 h-4 bg-muted/40 rounded" />
                  </div>
                </div>
                <div className="w-full h-8 bg-muted/30 rounded" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-8 sm:p-12 shadow-xs text-center flex flex-col items-center justify-center">
            <div className="size-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
              {statusFilter === "all" ? (
                <Pizza className="size-8" />
              ) : (
                <AlertCircle className="size-8" />
              )}
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground">
              {statusFilter === "all"
                ? "No menu items yet"
                : `No ${statusFilter} items found`}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm">
              {statusFilter === "all"
                ? "Get started by adding your first delicious pizza, side, or beverage."
                : `There are currently no items under the ${statusFilter} filter.`}
            </p>
            {statusFilter === "all" ? (
              <Link
                href="/dashboard/vendor/add-item"
                className="mt-5 inline-flex items-center gap-2 bg-[#c22d2f] hover:bg-[#a82527] text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-full shadow-md transition-all cursor-pointer"
              >
                <Plus className="size-4" />
                Add Your First Item
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="mt-5 inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Show All Items
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {paginatedItems.map((item) => (
              <VendorMenuItemCard
                key={item._id}
                item={item}
                onToggleActive={handleToggleActive}
                onView={(it) => setViewingItem(it)}
                onEdit={(it) => setEditingItem(it)}
                onDelete={(it) => setDeletingItem(it)}
                isToggling={togglingId === item._id}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredItems.length > 0 && (
          <VendorItemsPagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredItems.length}
            pageSize={PAGE_SIZE}
            onPageChange={(p) => {
              setCurrentPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}
      </main>

      {/* Modals */}
      <VendorViewItemModal
        item={viewingItem}
        isOpen={!!viewingItem}
        onClose={() => setViewingItem(null)}
      />

      <VendorEditItemModal
        item={editingItem}
        isOpen={!!editingItem}
        onClose={() => setEditingItem(null)}
        onItemUpdated={handleItemUpdated}
      />

      <VendorDeleteItemModal
        item={deletingItem}
        isOpen={!!deletingItem}
        isDeleting={isDeleting}
        onClose={() => setDeletingItem(null)}
        onConfirmDelete={handleConfirmDelete}
      />

      <VendorUpgradeLimitModal
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
      />
    </div>
  );
}

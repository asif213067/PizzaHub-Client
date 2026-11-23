"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AdminMenuApproval } from "@/components/dashboard/admin/admin-menu-approval";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { AdminMenuItem } from "@/types/admin";
import { menuService } from "@/services/menu.service";

export default function AdminItemsPage() {
  const { data: session } = useSession();

  const [menuItems, setMenuItems] = useState<AdminMenuItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [itemPage, setItemPage] = useState(1);
  const [itemTotalPages, setItemTotalPages] = useState(1);
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [itemSearch, setItemSearch] = useState("");
  const [itemStatusFilter, setItemStatusFilter] = useState("all");
  const [itemCategoryFilter, setItemCategoryFilter] = useState("all");

  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  const fetchMenuItems = useCallback(async () => {
    setItemsLoading(true);
    try {
      const res = await menuService.getAdminAllItems({
        page: itemPage,
        limit: 12,
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

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Menu Item Approval"
        subtitle="Review, approve, reject, or deactivate vendor menu items across the platform."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6">
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
          onItemStatusUpdated={fetchMenuItems}
        />
      </main>
    </div>
  );
}

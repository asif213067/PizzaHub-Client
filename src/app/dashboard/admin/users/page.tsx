"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { AdminUserTable } from "@/components/dashboard/admin/admin-user-table";
import { api, syncAuthToken } from "@/lib/api-client";
import { useSession } from "@/lib/auth-client";
import { AdminUser } from "@/types/admin";

export default function AdminUsersPage() {
  const { data: session } = useSession();

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [userPage, setUserPage] = useState(1);
  const [userTotalPages, setUserTotalPages] = useState(1);
  const [totalUsersCount, setTotalUsersCount] = useState(0);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  useEffect(() => {
    if (session?.user?.email) {
      syncAuthToken(session.user.email);
    }
  }, [session]);

  const fetchUsers = useCallback(async () => {
    setUsersLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: userPage.toString(),
        limit: "15",
        role: userRoleFilter,
        ...(userSearch.trim() ? { search: userSearch.trim() } : {}),
      });

      const res = await api.get<{
        success: boolean;
        data: AdminUser[];
        pagination: { total: number; totalPages: number };
      }>(`/api/admin/users?${queryParams.toString()}`);

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

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="flex-1 flex flex-col">
      <DashboardHeader
        title="Users & Vendors"
        subtitle="Manage registered customers, restaurant partners, and access permissions."
      />

      <main className="flex-1 px-4 sm:px-6 lg:px-8 pb-12 max-w-7xl w-full mx-auto space-y-6">
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
          onUserStatusUpdated={fetchUsers}
        />
      </main>
    </div>
  );
}

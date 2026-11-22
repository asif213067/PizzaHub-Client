"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  ShieldAlert,
  ShieldCheck,
  UserX,
  UserCheck,
  Building2,
  Mail,
  Calendar,
  Loader2,
  AlertCircle,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { AdminUser } from "@/types/admin";
import { api } from "@/lib/api-client";

interface AdminUserTableProps {
  users: AdminUser[];
  totalUsers: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onRoleChange: (role: string) => void;
  selectedRole: string;
  searchQuery: string;
  currentAdminEmail?: string;
  onUserStatusUpdated?: () => void;
}

export function AdminUserTable({
  users,
  totalUsers,
  currentPage,
  totalPages,
  loading,
  onPageChange,
  onSearchChange,
  onRoleChange,
  selectedRole,
  searchQuery,
  currentAdminEmail,
  onUserStatusUpdated,
}: AdminUserTableProps) {
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [modalUser, setModalUser] = useState<AdminUser | null>(null);

  async function handleToggleBlock(user: AdminUser) {
    try {
      setBlockingUserId(user._id);
      const nextBlocked = !user.isBlocked;

      const res = await api.patch<{ success: boolean; message: string }>(
        `/api/admin/users/${user._id}/block`,
        { isBlocked: nextBlocked }
      );

      if (res?.success) {
        toast.success(
          nextBlocked
            ? `User ${user.name} has been blocked.`
            : `User ${user.name} has been unblocked.`
        );
        setModalUser(null);
        if (onUserStatusUpdated) {
          onUserStatusUpdated();
        }
      } else {
        toast.error(res?.message || "Failed to update user block status.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to toggle block status.";
      toast.error(msg);
    } finally {
      setBlockingUserId(null);
    }
  }

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            User Management & Vendors
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalUsers} registered account{totalUsers === 1 ? "" : "s"}
          </p>
        </div>

        {/* Search & Role Filter */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search users or restaurants..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <select
            value={selectedRole}
            onChange={(e) => onRoleChange(e.target.value)}
            className="bg-muted/40 dark:bg-muted border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Roles</option>
            <option value="vendor">Vendors</option>
            <option value="customer">Customers</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Table Content */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between p-3.5 rounded-2xl bg-muted/20 animate-pulse gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-muted/60" />
                <div className="space-y-1.5">
                  <div className="w-32 h-3.5 bg-muted/60 rounded" />
                  <div className="w-48 h-3 bg-muted/40 rounded" />
                </div>
              </div>
              <div className="w-20 h-6 bg-muted/50 rounded-full" />
            </div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <UserX className="size-10 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-sm font-semibold text-foreground">No users found</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Try adjusting your search criteria or role filters.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-100 dark:border-stone-800 text-[11px] font-semibold text-muted-foreground">
                <th className="py-2.5 px-3">User</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Business / Tier</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Registered</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 dark:divide-stone-800/80">
              {users.map((u) => {
                const isSelf = currentAdminEmail && u.email?.toLowerCase() === currentAdminEmail.toLowerCase();
                const isAdmin = u.role === "admin";
                const isBlocked = Boolean(u.isBlocked);
                const initial = (u.name || "U").charAt(0).toUpperCase();

                return (
                  <tr key={u._id} className="hover:bg-muted/30 transition-colors">
                    {/* User Details */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        {u.image ? (
                          <div className="relative size-8 shrink-0">
                            <Image
                              src={u.image}
                              alt={u.name || "User"}
                              fill
                              className="rounded-full object-cover border border-stone-200 dark:border-stone-700"
                            />
                          </div>
                        ) : (
                          <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0 border border-primary/20">
                            {initial}
                          </div>
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {u.name || "Anonymous User"}
                            {isSelf && (
                              <span className="ml-1 text-[10px] text-muted-foreground font-normal">
                                (You)
                              </span>
                            )}
                          </p>
                          <p className="text-[11px] text-muted-foreground truncate max-w-[150px] sm:max-w-[200px]">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {u.role === "admin" ? (
                        <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          Administrator
                        </span>
                      ) : u.role === "vendor" ? (
                        <span className="bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <Building2 className="size-3" />
                          Vendor
                        </span>
                      ) : (
                        <span className="bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 rounded-full px-2 py-0.5 text-[10px] font-semibold">
                          Customer
                        </span>
                      )}
                    </td>

                    {/* Business Name or Tier */}
                    <td className="py-3 px-3">
                      {u.role === "vendor" ? (
                        <div className="space-y-0.5">
                          <p className="font-medium text-foreground truncate max-w-[140px]">
                            {u.businessName || "Unnamed Restaurant"}
                          </p>
                          {u.subscriptionPlan === "premium" ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              <Star className="size-2.5 fill-amber-400" /> Premium Tier
                            </span>
                          ) : (
                            <span className="text-[10px] text-muted-foreground">Free Tier</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {isBlocked ? (
                        <span className="bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900 rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <ShieldAlert className="size-3" />
                          Blocked
                        </span>
                      ) : (
                        <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1 w-fit">
                          <ShieldCheck className="size-3" />
                          Active
                        </span>
                      )}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-3 text-muted-foreground whitespace-nowrap">
                      {u.createdAt
                        ? new Date(u.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </td>

                    {/* Block/Unblock Action */}
                    <td className="py-3 px-3 text-right whitespace-nowrap">
                      {isAdmin || isSelf ? (
                        <span className="text-[11px] text-muted-foreground italic">Protected</span>
                      ) : (
                        <button
                          type="button"
                          disabled={blockingUserId === u._id}
                          onClick={() => setModalUser(u)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all cursor-pointer ${
                            isBlocked
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs"
                              : "border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                          } disabled:opacity-50`}
                        >
                          {blockingUserId === u._id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : isBlocked ? (
                            "Unblock"
                          ) : (
                            "Block User"
                          )}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-3 py-1 rounded-full border border-border text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-3 py-1 rounded-full border border-border text-foreground hover:bg-muted disabled:opacity-40 cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white dark:bg-card border border-stone-200 dark:border-stone-800 rounded-3xl max-w-sm w-full p-5 shadow-xl space-y-4">
            <div className="flex items-start gap-3">
              <div className={`size-10 rounded-2xl flex items-center justify-center shrink-0 ${
                modalUser.isBlocked ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-600" : "bg-rose-50 dark:bg-rose-950 text-rose-600"
              }`}>
                {modalUser.isBlocked ? <UserCheck className="size-5" /> : <UserX className="size-5" />}
              </div>
              <div>
                <h3 className="font-heading text-base font-bold text-foreground">
                  {modalUser.isBlocked ? "Unblock Account?" : "Block Account?"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {modalUser.isBlocked
                    ? `Allow ${modalUser.name} (${modalUser.email}) to log in and use PizzaHub.`
                    : `Prevent ${modalUser.name} (${modalUser.email}) from logging in and accessing orders.`}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModalUser(null)}
                className="px-3.5 py-1.5 rounded-full text-xs font-semibold border border-border text-muted-foreground hover:text-foreground cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleToggleBlock(modalUser)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold text-white shadow-xs cursor-pointer ${
                  modalUser.isBlocked
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                Confirm {modalUser.isBlocked ? "Unblock" : "Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

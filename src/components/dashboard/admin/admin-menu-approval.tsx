"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  Check,
  X,
  Pizza,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { AdminMenuItem } from "@/types/admin";
import { api } from "@/lib/api-client";

interface AdminMenuApprovalProps {
  items: AdminMenuItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void;
  onStatusFilterChange: (status: string) => void;
  onCategoryFilterChange: (category: string) => void;
  selectedStatus: string;
  selectedCategory: string;
  searchQuery: string;
  onItemStatusUpdated?: () => void;
}

const CATEGORIES = [
  "All Categories",
  "Classic Pizzas",
  "Vegetarian Pizzas",
  "Meat Lovers",
  "Gourmet Pizzas",
  "Sides & Appetizers",
  "Beverages & Desserts",
];

export function AdminMenuApproval({
  items,
  totalItems,
  currentPage,
  totalPages,
  loading,
  onPageChange,
  onSearchChange,
  onStatusFilterChange,
  onCategoryFilterChange,
  selectedStatus,
  selectedCategory,
  searchQuery,
  onItemStatusUpdated,
}: AdminMenuApprovalProps) {
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  async function handleUpdateStatus(item: AdminMenuItem, newStatus: "approved" | "rejected" | "inactive" | "pending") {
    try {
      setUpdatingItemId(item._id);
      const res = await api.patch<{ success: boolean; message: string }>(
        `/api/menu/${item._id}/status`,
        { status: newStatus }
      );

      if (res?.success) {
        toast.success(`"${item.itemName}" marked as ${newStatus}`);
        if (onItemStatusUpdated) {
          onItemStatusUpdated();
        }
      } else {
        toast.error(res?.message || "Failed to update item status.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update item status.";
      toast.error(msg);
    } finally {
      setUpdatingItemId(null);
    }
  }

  return (
    <div className="bg-white dark:bg-card border border-stone-200/70 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col gap-5">
      {/* Top Header & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-stone-100 dark:border-stone-800">
        <div>
          <h2 className="font-heading text-lg font-bold text-foreground">
            Menu Items & Approval Queue
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {totalItems} item{totalItems === 1 ? "" : "s"} found across vendor kitchens
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative min-w-[180px] flex-1 sm:flex-initial">
            <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search pizza..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-muted/40 dark:bg-muted border border-border rounded-full pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground outline-none focus:ring-1 focus:ring-ring transition"
            />
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-muted/40 dark:bg-muted border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">⏳ Pending Review</option>
            <option value="approved">✅ Approved</option>
            <option value="rejected">❌ Rejected</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            className="bg-muted/40 dark:bg-muted border border-border rounded-full px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:ring-1 focus:ring-ring cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat === "All Categories" ? "all" : cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Items List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-4 rounded-3xl bg-muted/20 border border-border/40 animate-pulse flex gap-4"
            >
              <div className="size-20 rounded-2xl bg-muted/60 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-muted/60 rounded" />
                <div className="w-20 h-3 bg-muted/40 rounded" />
                <div className="w-24 h-5 bg-muted/50 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Pizza className="size-10 mx-auto text-muted-foreground/60 mb-2" />
          <p className="text-sm font-semibold text-foreground">No menu items found</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Try resetting your status or category filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((item) => {
            const isUpdating = updatingItemId === item._id;
            const primaryImage =
              Array.isArray(item.images) && item.images.length > 0
                ? item.images[0]
                : "/pizza-placeholder.jpg";

            return (
              <div
                key={item._id}
                className="bg-stone-50/70 dark:bg-stone-900/40 border border-stone-200/60 dark:border-stone-800 rounded-3xl p-4 flex flex-col justify-between gap-3 hover:border-primary/40 transition-colors"
              >
                {/* Upper Details */}
                <div className="flex items-start gap-3.5">
                  <div className="relative size-20 rounded-2xl overflow-hidden bg-muted shrink-0 border border-stone-200/80 dark:border-stone-700">
                    <Image
                      src={primaryImage}
                      alt={item.itemName}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-heading font-bold text-sm text-foreground truncate">
                        {item.itemName}
                      </h3>
                      <span className="font-bold text-sm text-foreground shrink-0">
                        ${Number(item.price).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">
                      {item.category}
                    </p>

                    {/* Vendor Info */}
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-600 dark:text-stone-300 mt-1 truncate">
                      <Building2 className="size-3 shrink-0 text-muted-foreground" />
                      <span className="truncate font-medium">
                        {item.vendor?.businessName || item.vendor?.name || "Vendor Kitchen"}
                      </span>
                    </div>

                    {item.location && (
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground mt-0.5 truncate">
                        <MapPin className="size-2.5 shrink-0" />
                        <span className="truncate">{item.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status Badge & Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-stone-800/80">
                  {/* Status Badge */}
                  <div>
                    {item.status === "pending" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                        <Clock className="size-3" /> Pending Review
                      </span>
                    )}
                    {item.status === "approved" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900">
                        <CheckCircle2 className="size-3" /> Approved
                      </span>
                    )}
                    {item.status === "rejected" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                        <XCircle className="size-3" /> Rejected
                      </span>
                    )}
                    {item.status === "inactive" && (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-700">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {item.status !== "approved" && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(item, "approved")}
                        className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="size-3 animate-spin" /> : <Check className="size-3" />}
                        Approve
                      </button>
                    )}
                    {item.status !== "rejected" && (
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleUpdateStatus(item, "rejected")}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isUpdating ? <Loader2 className="size-3 animate-spin" /> : <X className="size-3" />}
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
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
    </div>
  );
}

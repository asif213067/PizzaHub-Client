import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  menuService,
  MenuItemsQueryParams,
  CreateMenuItemPayload,
  UpdateMenuItemPayload,
} from "@/services/menu.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

// Public Menu Hooks
export function usePublicMenu(params: MenuItemsQueryParams = {}) {
  return useQuery({
    queryKey: queryKeys.menu.list(params as Record<string, unknown>),
    queryFn: () => menuService.getPublicItems(params),
    staleTime: CACHE_POLICIES.PUBLIC_MENU.staleTime,
    gcTime: CACHE_POLICIES.PUBLIC_MENU.gcTime,
  });
}

export function useFeaturedMenu(limit: number = 6) {
  return useQuery({
    queryKey: [...queryKeys.menu.featured(), limit],
    queryFn: () => menuService.getFeaturedItems(limit),
    staleTime: CACHE_POLICIES.PUBLIC_MENU.staleTime,
    gcTime: CACHE_POLICIES.PUBLIC_MENU.gcTime,
  });
}

export function useMenuItem(id: string) {
  return useQuery({
    queryKey: queryKeys.menu.detail(id),
    queryFn: () => menuService.getItemById(id),
    enabled: Boolean(id),
    staleTime: CACHE_POLICIES.PUBLIC_MENU.staleTime,
    gcTime: CACHE_POLICIES.PUBLIC_MENU.gcTime,
  });
}

export function useRelatedMenuItems(id: string, limit: number = 3) {
  return useQuery({
    queryKey: [...queryKeys.menu.related(id), limit],
    queryFn: () => menuService.getRelatedItems(id, limit),
    enabled: Boolean(id),
    staleTime: CACHE_POLICIES.PUBLIC_MENU.staleTime,
  });
}

// Vendor Menu Hooks
export function useVendorMenuItems() {
  return useQuery({
    queryKey: [...queryKeys.menu.all, "vendor-items"],
    queryFn: () => menuService.getVendorItems(),
    staleTime: CACHE_POLICIES.VENDOR_MENU.staleTime,
    gcTime: CACHE_POLICIES.VENDOR_MENU.gcTime,
  });
}

export function useCreateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateMenuItemPayload) => menuService.createItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateMenuItemPayload }) =>
      menuService.updateItem(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => menuService.deleteItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
    },
  });
}

// Admin Menu Hooks
export function useAdminMenuItems(params: {
  status?: string;
  category?: string;
  search?: string;
  page?: number | string;
  limit?: number | string;
} = {}) {
  return useQuery({
    queryKey: queryKeys.admin.menuItems(params as Record<string, unknown>),
    queryFn: () => menuService.getAdminAllItems(params),
    staleTime: CACHE_POLICIES.ADMIN_DATA.staleTime,
    gcTime: CACHE_POLICIES.ADMIN_DATA.gcTime,
    refetchOnWindowFocus: CACHE_POLICIES.ADMIN_DATA.refetchOnWindowFocus,
  });
}

export function useUpdateMenuItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "approved" | "rejected" | "inactive" | "pending";
    }) => menuService.updateItemStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.menu.all });
    },
  });
}

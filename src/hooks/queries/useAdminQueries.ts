import { useQuery } from "@tanstack/react-query";
import { adminService } from "@/services/admin.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

export function useAdminOverview() {
  return useQuery({
    queryKey: queryKeys.admin.overview(),
    queryFn: () => adminService.getOverviewStats(),
    staleTime: CACHE_POLICIES.ADMIN_DATA.staleTime,
    gcTime: CACHE_POLICIES.ADMIN_DATA.gcTime,
    refetchOnWindowFocus: CACHE_POLICIES.ADMIN_DATA.refetchOnWindowFocus,
  });
}

export function useAdminTransactions() {
  return useQuery({
    queryKey: queryKeys.payment.adminTransactions(),
    queryFn: () => adminService.getTransactions(),
    staleTime: CACHE_POLICIES.ADMIN_DATA.staleTime,
    gcTime: CACHE_POLICIES.ADMIN_DATA.gcTime,
    refetchOnWindowFocus: CACHE_POLICIES.ADMIN_DATA.refetchOnWindowFocus,
  });
}

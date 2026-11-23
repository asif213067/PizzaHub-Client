import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService, UpdateUserProfilePayload } from "@/services/user.service";
import { queryKeys, CACHE_POLICIES } from "@/lib/query-keys";

export function useUserProfile() {
  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: () => userService.getProfile(),
    staleTime: CACHE_POLICIES.USER_PROFILE.staleTime,
    gcTime: CACHE_POLICIES.USER_PROFILE.gcTime,
  });
}

export function useUpdateUserProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateUserProfilePayload) => userService.updateProfile(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.adminUsers() });
    },
  });
}

export function useAdminUsers() {
  return useQuery({
    queryKey: queryKeys.user.adminUsers(),
    queryFn: () => userService.getAdminUsers(),
    staleTime: CACHE_POLICIES.ADMIN_DATA.staleTime,
    gcTime: CACHE_POLICIES.ADMIN_DATA.gcTime,
    refetchOnWindowFocus: CACHE_POLICIES.ADMIN_DATA.refetchOnWindowFocus,
  });
}

export function useToggleBlockUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userService.toggleBlockUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.adminUsers() });
    },
  });
}

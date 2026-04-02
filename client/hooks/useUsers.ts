// hooks/useUsers.ts
// TanStack Query hooks for the User resource

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchUserByUsername,
  fetchUserById,
  updateProfile,
  uploadAvatar,
} from "@/services/usersService";
import { User } from "@/types";
import apiClient from "@/lib/apiClient";

export const useUserByUsername = (username: string) => {
  return useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const { data } = await apiClient.get(
        `/users?filters[username][$eq]=${username}&populate=avatar`,
      );
      return data[0] || null;
    },
    enabled: !!username,
  });
};

export function useUserById(
  id: number,
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: { bio?: string; username?: string };
    }) => updateProfile(userId, data),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.byId(user.id) });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) =>
      uploadAvatar(userId, file),
  });
}

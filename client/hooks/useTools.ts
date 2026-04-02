// hooks/useTools.ts
// TanStack Query hooks for the Tool resource

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchTools,
  fetchToolBySlug,
  fetchToolById,
  fetchToolsByIds,
  fetchFeaturedTools,
  fetchTopRatedTools,
  fetchUserSubmittedTools,
  submitTool,
} from "@/services/toolsService";
import { Tool, ApiResponse, ToolsQueryParams } from "@/types";
import apiClient, { buildQuery } from "@/lib/apiClient";

export function useTools(
  params: ToolsQueryParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Tool[]>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.list(params),
    queryFn: () => fetchTools(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useTool(
  slug: string,
  options?: Omit<UseQueryOptions<Tool | null>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.detail(slug),
    queryFn: () => fetchToolBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

// hooks/useTools.ts
export function useToolById(
  id: number | string | null,
  options?: Omit<UseQueryOptions<Tool>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.byId(id as any),
    queryFn: () => {
      if (!id) throw new Error("ID is required");
      return fetchToolById(id);
    },
    enabled: !!id && id !== 0 && id !== "0",
    ...options,
  });
}

export function useToolsByIds(
  ids: number[],
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.byIds(ids),
    queryFn: () => fetchToolsByIds(ids),
    enabled: ids.length > 0,
    ...options,
  });
}

export function useFeaturedTools(
  limit = 6,
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.featured(limit),
    queryFn: () => fetchFeaturedTools(limit),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useTopRatedTools(
  limit = 10,
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.topRated(limit),
    queryFn: () => fetchTopRatedTools(limit),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export const useUserSubmittedTools = (userId: number, options = {}) => {
  return useQuery({
    queryKey: ["user-submitted-tools", userId],
    queryFn: async () => {
      if (!userId || userId === 0) return [];

      const query = buildQuery({
        filters: {
          submittedBy: userId,
        },
        populate: ["logo", "categories"],
        sort: ["createdAt:desc"],
      });

      const { data } = await apiClient.get(`/tools${query}`);
      return data.data as Tool[];
    },
    enabled: !!userId && userId !== 0,
    ...options,
  });
};

export function useSubmitTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitTool,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tools.all() });
    },
  });
}

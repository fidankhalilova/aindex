// hooks/useCategories.ts
// TanStack Query hooks for the Category resource

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchCategories,
  fetchCategoryBySlug,
} from "@/services/categoriesService";
import { Category, ApiResponse } from "@/types";

export function useCategories(
  options?: Omit<
    UseQueryOptions<ApiResponse<Category[]>>,
    "queryKey" | "queryFn"
  >,
) {
  return useQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useCategory(
  slug: string,
  options?: Omit<UseQueryOptions<Category | null>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.categories.bySlug(slug),
    queryFn: () => fetchCategoryBySlug(slug),
    enabled: !!slug,
    ...options,
  });
}

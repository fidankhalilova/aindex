// lib/prefetch.ts
// SSR prefetch helpers for TanStack Query

import { QueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTools } from "@/services/toolsService";
import { fetchCategories } from "@/services/categoriesService";
import { ToolsQueryParams } from "@/types";

export async function prefetchTools(
  queryClient: QueryClient,
  params: ToolsQueryParams = {},
) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.tools.list(params),
    queryFn: () => fetchTools(params),
  });
}

export async function prefetchCategories(queryClient: QueryClient) {
  await queryClient.prefetchQuery({
    queryKey: queryKeys.categories.all(),
    queryFn: fetchCategories,
  });
}

// hooks/useTags.ts
// TanStack Query hooks for the Tag resource

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchTags } from "@/services/tagsService";
import { Tag } from "@/types";

export function useTags(
  options?: Omit<UseQueryOptions<Tag[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tags.all(),
    queryFn: fetchTags,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

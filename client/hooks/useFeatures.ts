// hooks/useFeatures.ts
// TanStack Query hooks for the Feature resource

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import { fetchFeatures } from "@/services/featuresService";
import { Feature } from "@/types";

export function useFeatures(
  options?: Omit<UseQueryOptions<Feature[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.features.all(),
    queryFn: fetchFeatures,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

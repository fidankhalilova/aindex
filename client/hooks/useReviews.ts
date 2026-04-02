// hooks/useReviews.ts
// TanStack Query hooks for the Review resource

import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import { queryKeys } from "@/lib/queryKeys";
import {
  fetchReviewsByTool,
  fetchReviewsByUser,
  createReview,
  updateReview,
  deleteReview,
} from "@/services/reviewsService";
import { Review, ReviewCreateData } from "@/types";

export function useReviewsByTool(
  toolId: number,
  options?: Omit<UseQueryOptions<Review[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.reviews.byTool(toolId),
    queryFn: () => fetchReviewsByTool(toolId),
    enabled: !!toolId,
    ...options,
  });
}

export function useReviewsByUser(
  userId: number,
  options?: Omit<UseQueryOptions<Review[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.reviews.byUser(userId),
    queryFn: () => fetchReviewsByUser(userId),
    enabled: !!userId,
    ...options,
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ReviewCreateData) => createReview(data),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: queryKeys.reviews.byTool(vars.tool) });
    },
  });
}

export function useUpdateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: Partial<ReviewCreateData>;
    }) => updateReview(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

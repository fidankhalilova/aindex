// services/reviewsService.ts
// All raw API calls for the Review resource

import apiClient, { buildQuery } from "@/lib/apiClient";
import { Review, ApiResponse, ReviewCreateData } from "@/types";

export async function fetchReviewsByTool(toolId: number): Promise<Review[]> {
  const query = buildQuery({
    populate: { user: true },
    filters: { tool: { id: { $eq: toolId } } },
    sort: "createdAt:desc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Review[]>>(`/reviews${query}`);
  return res.data.data ?? [];
}

export async function fetchReviewsByUser(userId: number): Promise<Review[]> {
  const query = buildQuery({
    populate: { tool: { populate: { logo: true, categories: true } } },
    filters: { user: { id: { $eq: userId } } },
    sort: "createdAt:desc",
    pagination: { page: 1, pageSize: 50 },
  });
  const res = await apiClient.get<ApiResponse<Review[]>>(`/reviews${query}`);
  return res.data.data ?? [];
}

export async function createReview(data: ReviewCreateData): Promise<Review> {
  const res = await apiClient.post<ApiResponse<Review>>("/reviews", { data });
  return res.data.data;
}

export async function updateReview(
  id: number,
  data: Partial<ReviewCreateData>,
): Promise<Review> {
  const res = await apiClient.put<ApiResponse<Review>>(`/reviews/${id}`, {
    data,
  });
  return res.data.data;
}

export async function deleteReview(id: number): Promise<void> {
  await apiClient.delete(`/reviews/${id}`);
}

// services/categoriesService.ts
// All raw API calls for the Category resource

import apiClient, { buildQuery } from "@/lib/apiClient";
import { Category, ApiResponse } from "@/types";

export async function fetchCategories(): Promise<ApiResponse<Category[]>> {
  const query = buildQuery({
    sort: "name:asc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Category[]>>(
    `/categories${query}`,
  );
  return res.data;
}

export async function fetchCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const query = buildQuery({
    populate: { tools: true },
    filters: { slug: { $eq: slug } },
  });
  const res = await apiClient.get<ApiResponse<Category[]>>(
    `/categories${query}`,
  );
  return res.data.data?.[0] ?? null;
}

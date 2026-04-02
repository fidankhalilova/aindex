// services/featuresService.ts
// All raw API calls for the Feature resource

import apiClient, { buildQuery } from "@/lib/apiClient";
import { Feature, ApiResponse } from "@/types";

export async function fetchFeatures(): Promise<Feature[]> {
  const query = buildQuery({
    sort: "name:asc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Feature[]>>(`/features${query}`);
  return res.data.data ?? [];
}

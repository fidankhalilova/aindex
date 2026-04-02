// services/tagsService.ts
// All raw API calls for the Tag resource

import apiClient, { buildQuery } from "@/lib/apiClient";
import { Tag, ApiResponse } from "@/types";

export async function fetchTags(): Promise<Tag[]> {
  const query = buildQuery({
    sort: "name:asc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Tag[]>>(`/tags${query}`);
  return res.data.data ?? [];
}

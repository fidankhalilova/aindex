// services/toolsService.ts
// All raw API calls for the Tool resource

import apiClient, { buildQuery, TOOL_POPULATE } from "@/lib/apiClient";
import { Tool, ApiResponse, ToolsQueryParams, ToolSubmitData } from "@/types";

export async function fetchTools(
  params: ToolsQueryParams = {},
): Promise<ApiResponse<Tool[]>> {
  const {
    search = "",
    category,
    pricing,
    sort = "newest",
    page = 1,
    pageSize = 12,
    featured,
    verified,
  } = params;

  const filters: Record<string, unknown> = {
    state: { $eq: "Published" },
  };

  if (search) {
    filters.$or = [
      { name: { $containsi: search } },
      { shortDescription: { $containsi: search } },
      { description: { $containsi: search } },
    ];
  }

  if (category && category !== "all") {
    filters.categories = { slug: { $eq: category } };
  }
  if (pricing && pricing !== "all") filters.pricing = { $eq: pricing };
  if (featured !== undefined) filters.isFeatured = { $eq: featured };
  if (verified !== undefined) filters.isVerified = { $eq: verified };

  const sortMap: Record<string, string> = {
    newest: "createdAt:desc",
    rating: "averageRating:desc",
    popular: "viewsCount:desc",
    name: "name:asc",
  };

  const query = buildQuery({
    ...TOOL_POPULATE,
    filters,
    sort: sortMap[sort] ?? "createdAt:desc",
    pagination: { page, pageSize },
  });

  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data;
}

export async function fetchToolBySlug(slug: string): Promise<Tool | null> {
  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: { slug: { $eq: slug }, state: { $eq: "Published" } },
  });
  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data.data?.[0] ?? null;
}

// Replace the existing fetchToolById
// services/toolsService.ts
export async function fetchToolById(id: number | string): Promise<Tool> {
  const query = buildQuery(TOOL_POPULATE);

  try {
    // For Strapi v5, try using documentId if it's a string
    if (typeof id === "string" && id.length > 0) {
      // Try direct documentId fetch first
      const res = await apiClient.get<ApiResponse<Tool>>(
        `/tools/${id}${query}`,
      );
      return res.data.data;
    }

    // For numeric IDs, try direct fetch
    const res = await apiClient.get<ApiResponse<Tool>>(`/tools/${id}${query}`);
    return res.data.data;
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.warn(`Tool ${id} not found with direct ID, trying fallback...`);

      // Fallback: fetch via list with filters
      const listQuery = buildQuery({
        ...TOOL_POPULATE,
        filters: {
          $or: [
            { id: { $eq: typeof id === "string" ? parseInt(id) : id } },
            { documentId: { $eq: String(id) } },
            { slug: { $eq: String(id) } }, // Also try by slug
          ],
          state: { $eq: "Published" },
        },
        pagination: { page: 1, pageSize: 1 },
      });

      const listRes = await apiClient.get<ApiResponse<Tool[]>>(
        `/tools${listQuery}`,
      );
      const tool = listRes.data.data?.[0];

      if (!tool) throw new Error(`Tool with id ${id} not found`);
      return tool;
    }
    throw err;
  }
}

// Replace the existing fetchToolsByIds
export async function fetchToolsByIds(ids: number[]): Promise<Tool[]> {
  if (!ids.length) return [];

  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: {
      $or: [{ id: { $in: ids } }, { documentId: { $in: ids.map(String) } }],
      state: { $eq: "Published" },
    },
    pagination: { page: 1, pageSize: ids.length },
  });

  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data.data ?? [];
}

export async function fetchFeaturedTools(limit = 6): Promise<Tool[]> {
  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: { isFeatured: { $eq: true }, state: { $eq: "Published" } },
    sort: "averageRating:desc",
    pagination: { page: 1, pageSize: limit },
  });
  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data.data ?? [];
}

export async function fetchTopRatedTools(limit = 10): Promise<Tool[]> {
  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: { averageRating: { $gte: 4 }, state: { $eq: "Published" } },
    sort: "averageRating:desc",
    pagination: { page: 1, pageSize: limit },
  });
  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data.data ?? [];
}

export async function fetchUserSubmittedTools(userId: number): Promise<Tool[]> {
  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: { submittedBy: { id: { $eq: userId } } },
    sort: "createdAt:desc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Tool[]>>(`/tools${query}`);
  return res.data.data ?? [];
}

export async function submitTool(data: ToolSubmitData): Promise<Tool> {
  const res = await apiClient.post<ApiResponse<Tool>>("/tools", {
    data: {
      ...data,
      description: data.description || "",
      pricingDetails: data.pricingDetails || "",
      state: "Draft",
      averageRating: 0,
      reviewsCount: 0,
      viewsCount: 0,
      isVerified: false,
      isFeatured: false,
    },
  });
  return res.data.data;
}

export async function incrementToolViews(id: number): Promise<void> {
  try {
    // Use your existing function that builds the query with populate + filters
    const tool = await fetchToolById(id); // This already does /tools/${id}?populate=...

    const current = tool?.viewsCount ?? 0;
    await apiClient.put(`/tools/${id}`, {
      data: { viewsCount: current + 1 },
    });
  } catch (err) {
    console.error("[incrementViews] failed:", err);
  }
}

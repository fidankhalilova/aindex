// lib/api.ts
//
// Strapi v5  •  TanStack Query v5
//
// Confirmed field names from /api/tools?populate=*:
//   logo         → single media
//   categories   → array of Category   (NOT "category")
//   features     → array of Feature
//   tags         → array of Tag
//   screenshots  → media (null if not set)
//   submittedBy  → User relation
//   reviews      → array of Review

import axios, { AxiosInstance } from "axios";
import qs from "qs";
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseQueryOptions,
  QueryClient,
} from "@tanstack/react-query";
import {
  Tool,
  Category,
  Review,
  User,
  Feature,
  Tag,
  ApiResponse,
  ToolsQueryParams,
  ReviewCreateData,
  ToolSubmitData,
} from "@/types";

// ---------------------------------------------------------------------------
// Axios instance
// ---------------------------------------------------------------------------

const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://localhost:1337";
const API_TOKEN = process.env.NEXT_PUBLIC_STRAPI_API_TOKEN;

const apiClient: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const token =
    (typeof window !== "undefined" && localStorage.getItem("token")) ||
    API_TOKEN;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.data) {
      console.error("[Strapi]", JSON.stringify(err.response.data, null, 2));
    }
    return Promise.reject(err);
  },
);

// ---------------------------------------------------------------------------
// Query-string builder
// ---------------------------------------------------------------------------

function buildQuery(params: Record<string, unknown>): string {
  const clean = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
  if (!Object.keys(clean).length) return "";
  return (
    "?" + qs.stringify(clean, { encodeValuesOnly: true, allowDots: false })
  );
}

// ---------------------------------------------------------------------------
// Media URL helper
// ---------------------------------------------------------------------------

export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

// ---------------------------------------------------------------------------
// Confirmed populate shape (field names verified from live Strapi response)
// ---------------------------------------------------------------------------

const TOOL_POPULATE = {
  populate: {
    logo: true,
    categories: true, // ← plural, confirmed
    features: true,
    tags: true,
    screenshots: true,
    submittedBy: true,
  },
};

// ---------------------------------------------------------------------------
// Query keys
// ---------------------------------------------------------------------------

export const queryKeys = {
  tools: {
    all: () => ["tools"] as const,
    list: (p: ToolsQueryParams) => ["tools", "list", p] as const,
    detail: (slug: string) => ["tools", "detail", slug] as const,
    byId: (id: number) => ["tools", "id", id] as const,
    byIds: (ids: number[]) => ["tools", "ids", ids] as const,
    featured: (limit: number) => ["tools", "featured", limit] as const,
    topRated: (limit: number) => ["tools", "topRated", limit] as const,
    userSubmitted: (userId: number) => ["tools", "user", userId] as const,
  },
  categories: {
    all: () => ["categories"] as const,
    bySlug: (slug: string) => ["categories", slug] as const,
  },
  reviews: {
    byTool: (toolId: number) => ["reviews", "tool", toolId] as const,
    byUser: (userId: number) => ["reviews", "user", userId] as const,
  },
  features: { all: () => ["features"] as const },
  tags: { all: () => ["tags"] as const },
  users: {
    byUsername: (u: string) => ["users", "username", u] as const,
    byId: (id: number) => ["users", "id", id] as const,
  },
};

// ===========================================================================
// TOOLS
// ===========================================================================

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
  // Filter by categories (plural) using the correct relation name
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

export async function fetchToolById(id: number): Promise<Tool> {
  const query = buildQuery(TOOL_POPULATE);
  const res = await apiClient.get<ApiResponse<Tool>>(`/tools/${id}${query}`);
  return res.data.data;
}

export async function fetchToolsByIds(ids: number[]): Promise<Tool[]> {
  if (!ids.length) return [];
  const query = buildQuery({
    ...TOOL_POPULATE,
    filters: { id: { $in: ids }, state: { $eq: "Published" } },
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
    const res = await apiClient.get<ApiResponse<Tool>>(`/tools/${id}`);
    const current = (res.data.data as any)?.viewsCount ?? 0;
    await apiClient.put(`/tools/${id}`, { data: { viewsCount: current + 1 } });
  } catch (err) {
    console.error("[incrementViews] failed:", err);
  }
}

// ── Hooks ──────────────────────────────────────────────────────────────────

export function useTools(
  params: ToolsQueryParams = {},
  options?: Omit<UseQueryOptions<ApiResponse<Tool[]>>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.list(params),
    queryFn: () => fetchTools(params),
    staleTime: 1000 * 60 * 2,
    ...options,
  });
}

export function useTool(
  slug: string,
  options?: Omit<UseQueryOptions<Tool | null>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.detail(slug),
    queryFn: () => fetchToolBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 5,
    ...options,
  });
}

export function useToolById(
  id: number,
  options?: Omit<UseQueryOptions<Tool>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.byId(id),
    queryFn: () => fetchToolById(id),
    enabled: !!id,
    ...options,
  });
}

export function useToolsByIds(
  ids: number[],
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.byIds(ids),
    queryFn: () => fetchToolsByIds(ids),
    enabled: ids.length > 0,
    ...options,
  });
}

export function useFeaturedTools(
  limit = 6,
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.featured(limit),
    queryFn: () => fetchFeaturedTools(limit),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useTopRatedTools(
  limit = 10,
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.topRated(limit),
    queryFn: () => fetchTopRatedTools(limit),
    staleTime: 1000 * 60 * 10,
    ...options,
  });
}

export function useUserSubmittedTools(
  userId: number,
  options?: Omit<UseQueryOptions<Tool[]>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.tools.userSubmitted(userId),
    queryFn: () => fetchUserSubmittedTools(userId),
    enabled: !!userId,
    ...options,
  });
}

export function useSubmitTool() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: submitTool,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: queryKeys.tools.all() });
    },
  });
}

// ===========================================================================
// CATEGORIES
// ===========================================================================

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

// ===========================================================================
// REVIEWS
// ===========================================================================

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
    mutationFn: (data: ReviewCreateData) =>
      apiClient
        .post<ApiResponse<Review>>("/reviews", { data })
        .then((r) => r.data.data),
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
    }) =>
      apiClient
        .put<ApiResponse<Review>>(`/reviews/${id}`, { data })
        .then((r) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

export function useDeleteReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => apiClient.delete(`/reviews/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["reviews"] });
    },
  });
}

// ===========================================================================
// USERS
// ===========================================================================

export async function fetchUserByUsername(
  username: string,
): Promise<User | null> {
  try {
    const res = await apiClient.get<User[]>(
      `/users?filters[username][$eq]=${encodeURIComponent(username)}&populate=avatar`,
    );
    return res.data?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function fetchUserById(id: number): Promise<User> {
  const res = await apiClient.get<User>(`/users/${id}?populate=avatar`);
  return res.data;
}

export function useUserByUsername(
  username: string,
  options?: Omit<UseQueryOptions<User | null>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.users.byUsername(username),
    queryFn: () => fetchUserByUsername(username),
    enabled: !!username,
    ...options,
  });
}

export function useUserById(
  id: number,
  options?: Omit<UseQueryOptions<User>, "queryKey" | "queryFn">,
) {
  return useQuery({
    queryKey: queryKeys.users.byId(id),
    queryFn: () => fetchUserById(id),
    enabled: !!id,
    ...options,
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      userId,
      data,
    }: {
      userId: number;
      data: { bio?: string; username?: string };
    }) => apiClient.put<User>(`/users/${userId}`, data).then((r) => r.data),
    onSuccess: (user) => {
      qc.invalidateQueries({ queryKey: queryKeys.users.byId(user.id) });
    },
  });
}

export function useUploadAvatar() {
  return useMutation({
    mutationFn: ({ userId, file }: { userId: number; file: File }) => {
      const form = new FormData();
      form.append("files", file);
      form.append("refId", String(userId));
      form.append("ref", "plugin::users-permissions.user");
      form.append("field", "avatar");
      return apiClient
        .post<User>("/upload", form, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((r) => r.data);
    },
  });
}

// ===========================================================================
// FEATURES
// ===========================================================================

export async function fetchFeatures(): Promise<Feature[]> {
  const query = buildQuery({
    sort: "name:asc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Feature[]>>(`/features${query}`);
  return res.data.data ?? [];
}

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

// ===========================================================================
// TAGS
// ===========================================================================

export async function fetchTags(): Promise<Tag[]> {
  const query = buildQuery({
    sort: "name:asc",
    pagination: { page: 1, pageSize: 100 },
  });
  const res = await apiClient.get<ApiResponse<Tag[]>>(`/tags${query}`);
  return res.data.data ?? [];
}

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

// ===========================================================================
// AUTH
// ===========================================================================

export const authApi = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
  }): Promise<{ jwt: string; user: User }> => {
    const res = await apiClient.post<{ jwt: string; user: User }>(
      "/auth/local/register",
      data,
    );
    return res.data;
  },

  login: async (data: {
    identifier: string;
    password: string;
  }): Promise<{ jwt: string; user: User }> => {
    const res = await apiClient.post<{ jwt: string; user: User }>(
      "/auth/local",
      data,
    );
    return res.data;
  },

  logout: (): void => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },
};

// ===========================================================================
// SSR prefetch helpers
// ===========================================================================

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

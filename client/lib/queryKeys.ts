// lib/queryKeys.ts
// Centralized TanStack Query key factory

import { ToolsQueryParams } from "@/types";

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

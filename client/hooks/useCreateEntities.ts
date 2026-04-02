// hooks/useCreateEntities.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import apiClient from "@/lib/apiClient";

// ── Create Category ──────────────────────────────────────────────
async function createCategory(
  name: string,
): Promise<{ id: number; name: string }> {
  const { data } = await apiClient.post("/categories", {
    data: { name: name.trim() },
  });
  return { id: data.data.id, name: data.data.attributes?.name ?? name };
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCategory,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}

// ── Create Feature ───────────────────────────────────────────────
async function createFeature(
  name: string,
): Promise<{ id: number; name: string; description: "" }> {
  const { data } = await apiClient.post("/features", {
    data: { name: name.trim() },
  });
  return {
    id: data.data.id,
    name: data.data.attributes?.name ?? name,
    description: "",
  };
}

export function useCreateFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createFeature,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["features"] }),
  });
}

// ── Create Tag ───────────────────────────────────────────────────
async function createTag(name: string): Promise<{ id: number; name: string }> {
  const { data } = await apiClient.post("/tags", {
    data: { name: name.trim() },
  });
  return { id: data.data.id, name: data.data.attributes?.name ?? name };
}

export function useCreateTag() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createTag,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["tags"] }),
  });
}

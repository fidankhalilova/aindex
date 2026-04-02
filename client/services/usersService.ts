// services/usersService.ts
// All raw API calls for the User resource

import apiClient from "@/lib/apiClient";
import { User } from "@/types";

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

export async function updateProfile(
  userId: number,
  data: { bio?: string; username?: string },
): Promise<User> {
  const res = await apiClient.put<User>(`/users/${userId}`, data);
  return res.data;
}

export async function uploadAvatar(userId: number, file: File): Promise<User> {
  const form = new FormData();
  form.append("files", file);
  form.append("refId", String(userId));
  form.append("ref", "plugin::users-permissions.user");
  form.append("field", "avatar");
  const res = await apiClient.post<User>("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

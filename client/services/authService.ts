// services/authService.ts
// Authentication calls (register, login, logout)

import apiClient from "@/lib/apiClient";
import { User } from "@/types";

export const authService = {
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

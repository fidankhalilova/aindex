// lib/apiClient.ts
// Shared Axios instance, media helper, and query-string builder

import axios, { AxiosInstance } from "axios";
import qs from "qs";

export const API_URL =
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

export function buildQuery(params: Record<string, unknown>): string {
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

export function getStrapiMedia(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${API_URL}${url}`;
}

// Confirmed populate shape (field names verified from live Strapi response)
export const TOOL_POPULATE = {
  populate: {
    logo: true,
    categories: true,
    features: true,
    tags: true,
    screenshots: true,
    submittedBy: true,
  },
};

export default apiClient;

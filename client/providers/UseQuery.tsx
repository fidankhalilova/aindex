"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Activity } from "react";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchInterval: false,
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});
const devMode = process.env.NODE_ENV === "development";
export default function UseQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>
      <Activity mode={devMode ? "visible" : "hidden"}>
        <ReactQueryDevtools />
      </Activity>
      {children}
    </QueryClientProvider>
  );
}

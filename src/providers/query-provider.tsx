"use client";

import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute default stale time
            gcTime: 5 * 60 * 1000, // 5 minutes cache retention
            refetchOnWindowFocus: false, // Prevent jarring refetches on window focus
            retry: (failureCount: number, error: unknown) => {
              // Avoid retrying on unauthenticated or client-side errors
              if (error instanceof Error) {
                const message = error.message;
                if (
                  message.includes("401") ||
                  message.includes("403") ||
                  message.includes("404")
                ) {
                  return false;
                }
              }
              if (typeof error === "object" && error !== null && "status" in error) {
                const status = (error as { status: unknown }).status;
                if (status === 401 || status === 403 || status === 404) {
                  return false;
                }
              }
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

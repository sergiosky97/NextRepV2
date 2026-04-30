"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { useAuthBootstrap } from "../features/auth/application/use-auth-bootstrap";
import { I18nProvider } from "./i18n-provider";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useAuthBootstrap();
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>{children}</I18nProvider>
    </QueryClientProvider>
  );
}

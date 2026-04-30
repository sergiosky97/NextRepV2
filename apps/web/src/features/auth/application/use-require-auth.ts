"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuthStore } from "./auth.store";

export function useRequireAuth() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);

  useEffect(() => {
    if (!session) router.replace("/login");
  }, [router, session]);

  return session;
}

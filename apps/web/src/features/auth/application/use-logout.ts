"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { clearAuthCookies } from "./auth-cookies";
import { authApiRepository } from "../infrastructure/auth-api.repository";
import { useAuthStore } from "./auth.store";

export function useLogout() {
  const router = useRouter();
  const session = useAuthStore((state) => state.session);
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: async () => {
      const token = session?.accessToken;
      if (!token) return;
      await authApiRepository.logout(token);
    },
    onSettled: () => {
      setSession(null);
      clearAuthCookies();
      router.replace("/login");
    }
  });
}

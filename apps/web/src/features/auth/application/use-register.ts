"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "./auth-cookies";
import { authApiRepository } from "../infrastructure/auth-api.repository";
import { useAuthStore } from "./auth.store";

export function useRegister() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const setRememberMe = useAuthStore((state) => state.setRememberMe);

  return useMutation({
    mutationFn: (payload: {
      email?: string;
      phone?: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => authApiRepository.register(payload),
    onSuccess: (session) => {
      setSession(session);
      setRememberMe(true);
      setAuthCookies(session.accessToken, session.refreshToken);
      router.push("/home");
    }
  });
}

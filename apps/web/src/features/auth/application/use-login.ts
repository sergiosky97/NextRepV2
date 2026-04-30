"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { setAuthCookies } from "./auth-cookies";
import { authApiRepository } from "../infrastructure/auth-api.repository";
import { useAuthStore } from "./auth.store";

export function useLogin() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const setRememberMe = useAuthStore((state) => state.setRememberMe);

  return useMutation({
    mutationFn: (payload: {
      email?: string;
      phone?: string;
      password: string;
      rememberMe: boolean;
    }) =>
      authApiRepository.login(payload),
    onSuccess: (session, variables) => {
      setSession(session);
      setRememberMe(variables.rememberMe);
      setAuthCookies(session.accessToken, session.refreshToken);
      router.push("/home");
    }
  });
}

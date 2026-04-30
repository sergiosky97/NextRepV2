"use client";

import { useEffect } from "react";
import { authApiRepository } from "../infrastructure/auth-api.repository";
import { clearAuthCookies, setAuthCookies } from "./auth-cookies";
import { useAuthStore } from "./auth.store";

export function useAuthBootstrap() {
  const session = useAuthStore((state) => state.session);
  const rememberMe = useAuthStore((state) => state.rememberMe);
  const setSession = useAuthStore((state) => state.setSession);

  useEffect(() => {
    const accessToken = session?.accessToken;
    if (!accessToken) return;

    void authApiRepository
      .getMe(accessToken)
      .then((user) =>
        setSession({
          accessToken,
          refreshToken: session.refreshToken,
          user
        })
      )
      .catch(async () => {
        if (!session?.refreshToken) {
          setSession(null);
          clearAuthCookies();
          return;
        }
        try {
          const refreshed = await authApiRepository.refresh(session.refreshToken);
          setSession(refreshed);
          setAuthCookies(refreshed.accessToken, refreshed.refreshToken);
        } catch {
          setSession(null);
          clearAuthCookies();
        }
      });
  }, [session?.accessToken, session?.refreshToken, setSession]);

  useEffect(() => {
    if (!rememberMe || !session?.refreshToken) return;
    let lastRefreshAt = Date.now();
    const handleActivity = () => {
      if (Date.now() - lastRefreshAt < 1000 * 60 * 3) return;
      lastRefreshAt = Date.now();
      void authApiRepository
        .refresh(session.refreshToken ?? "")
        .then((refreshed) => {
          setSession(refreshed);
          setAuthCookies(refreshed.accessToken, refreshed.refreshToken);
        })
        .catch(() => {
          setSession(null);
          clearAuthCookies();
        });
    };
    window.addEventListener("click", handleActivity);
    window.addEventListener("keydown", handleActivity);
    window.addEventListener("mousemove", handleActivity);
    return () => {
      window.removeEventListener("click", handleActivity);
      window.removeEventListener("keydown", handleActivity);
      window.removeEventListener("mousemove", handleActivity);
    };
  }, [rememberMe, session?.refreshToken, setSession]);
}

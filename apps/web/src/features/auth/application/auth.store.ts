"use client";

import { AuthSession } from "@nextrep/domain";
import { persist } from "zustand/middleware";
import { create } from "zustand";

export type AuthState = {
  session: AuthSession | null;
  rememberMe: boolean;
  setSession: (session: AuthSession | null) => void;
  setRememberMe: (remember: boolean) => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      rememberMe: false,
      setSession: (session) => set({ session }),
      setRememberMe: (rememberMe) => set({ rememberMe })
    }),
    {
      name: "nextrep-auth-session",
      partialize: (state) =>
        state.rememberMe
          ? { session: state.session, rememberMe: state.rememberMe }
          : { session: null, rememberMe: false }
    }
  )
);

"use client";

import { useMutation } from "@tanstack/react-query";
import { authApiRepository } from "../infrastructure/auth-api.repository";

export function useResetPassword() {
  return useMutation({
    mutationFn: (payload: { token: string; newPassword: string }) =>
      authApiRepository.resetPassword(payload.token, payload.newPassword)
  });
}

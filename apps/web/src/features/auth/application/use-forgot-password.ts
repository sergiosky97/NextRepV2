"use client";

import { useMutation } from "@tanstack/react-query";
import { authApiRepository } from "../infrastructure/auth-api.repository";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (emailOrPhone: string) => authApiRepository.forgotPassword(emailOrPhone)
  });
}

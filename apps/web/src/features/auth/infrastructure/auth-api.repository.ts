import { createApiClient } from "@nextrep/api-client/index";
import { AuthSession, AuthUser } from "@nextrep/domain";

const client = createApiClient({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000"
});

export const authApiRepository = {
  login(payload: {
    email?: string;
    phone?: string;
    password: string;
    rememberMe?: boolean;
  }): Promise<AuthSession> {
    return client.login({
      email: payload.email,
      phone: payload.phone,
      password: payload.password
    });
  },
  register(payload: {
    email?: string;
    phone?: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }): Promise<AuthSession> {
    return client.register(payload);
  },
  getMe(accessToken: string): Promise<AuthUser> {
    return client.getMe(accessToken);
  },
  refresh(refreshToken: string): Promise<AuthSession> {
    return client.refresh(refreshToken);
  },
  logout(accessToken: string): Promise<void> {
    return client.logout(accessToken).then(() => undefined);
  },
  forgotPassword(emailOrPhone: string): Promise<{ success: true; message: string }> {
    return client.forgotPassword(emailOrPhone);
  },
  resetPassword(token: string, newPassword: string): Promise<{ success: true }> {
    return client.resetPassword(token, newPassword);
  },
  updatePreferences(
    accessToken: string,
    payload: { themeMode?: "light" | "dark"; language?: string; avatarUrl?: string | null }
  ): Promise<AuthUser> {
    return client.updatePreferences(accessToken, payload);
  }
};

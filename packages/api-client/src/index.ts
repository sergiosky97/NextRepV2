export type ApiClientConfig = {
  baseUrl: string;
};

export type LoginPayload = {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export function createApiClient(config: ApiClientConfig) {
  return {
    async login(payload: LoginPayload) {
      const response = await fetch(`${config.baseUrl}/auth/login`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Login failed" }));
        throw new Error(error.message ?? "Login failed");
      }
      return response.json();
    },
    async getMe(accessToken: string) {
      const response = await fetch(`${config.baseUrl}/auth/me`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error("Unauthorized");
      return response.json();
    },
    async refresh(refreshToken: string) {
      const response = await fetch(`${config.baseUrl}/auth/refresh`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ refreshToken })
      });
      if (!response.ok) throw new Error("Could not refresh session");
      return response.json();
    },
    async logout(accessToken: string) {
      const response = await fetch(`${config.baseUrl}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      if (!response.ok) throw new Error("Could not logout");
      return response.json();
    },
    async forgotPassword(emailOrPhone: string) {
      const response = await fetch(`${config.baseUrl}/auth/forgot-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ emailOrPhone })
      });
      if (!response.ok) throw new Error("No se pudo iniciar la recuperacion");
      return response.json();
    },
    async resetPassword(token: string, newPassword: string) {
      const response = await fetch(`${config.baseUrl}/auth/reset-password`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "No se pudo cambiar la contrasena" }));
        throw new Error(error.message ?? "No se pudo cambiar la contrasena");
      }
      return response.json();
    },
    async updatePreferences(
      accessToken: string,
      payload: { themeMode?: "light" | "dark"; language?: string; avatarUrl?: string | null }
    ) {
      const response = await fetch(`${config.baseUrl}/auth/preferences`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "content-type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "No se pudieron guardar preferencias" }));
        throw new Error(error.message ?? "No se pudieron guardar preferencias");
      }
      return response.json();
    },
    async register(payload: LoginPayload) {
      const response = await fetch(`${config.baseUrl}/auth/register`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: "Register failed" }));
        throw new Error(error.message ?? "Register failed");
      }
      return response.json();
    },
    async getProfile(userId: string) {
      const response = await fetch(`${config.baseUrl}/profiles/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch profile");
      return response.json();
    }
  };
}

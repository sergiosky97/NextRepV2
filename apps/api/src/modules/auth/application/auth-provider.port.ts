import { AuthSessionEntity, AuthUserEntity } from "../domain/auth-user.entity";

export type LoginCommand = {
  email?: string;
  phone?: string;
  password: string;
  firstName?: string;
  lastName?: string;
};

export interface AuthProviderPort {
  signIn(command: LoginCommand): Promise<AuthSessionEntity>;
  signUp(command: LoginCommand): Promise<AuthSessionEntity>;
  refreshSession(refreshToken: string): Promise<AuthSessionEntity>;
  signOut(accessToken: string): Promise<void>;
  getUserByAccessToken(accessToken: string): Promise<AuthUserEntity | null>;
  requestPasswordReset(emailOrPhone: string): Promise<{ success: true; message: string }>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  updatePreferences(
    accessToken: string,
    payload: { themeMode?: "light" | "dark"; language?: string; avatarUrl?: string | null }
  ): Promise<AuthUserEntity>;
}

export type AuthUserEntity = {
  id: string;
  email: string;
  phone: string | null;
  displayName: string;
  avatarUrl: string | null;
  themeMode: "light" | "dark";
  language: string;
};

export type AuthSessionEntity = {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUserEntity;
};

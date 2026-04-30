export type UserId = string;

export type AuthCredentials = {
  email: string;
  password: string;
};

export type AuthUser = {
  id: UserId;
  email: string;
  phone: string | null;
  displayName: string;
  avatarUrl: string | null;
  themeMode: "light" | "dark";
  language: string;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string | null;
  user: AuthUser;
};

export type Profile = {
  userId: UserId;
  displayName: string;
  bio: string | null;
};

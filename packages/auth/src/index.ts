import { createClient } from "@supabase/supabase-js";
import { AuthCredentials, AuthSession, AuthUser } from "@nextrep/domain";

export interface AuthProvider {
  signIn(credentials: AuthCredentials): Promise<AuthSession>;
  signUp(credentials: AuthCredentials): Promise<AuthSession>;
  getSession(): Promise<AuthSession | null>;
  refreshSession(refreshToken: string): Promise<AuthSession>;
  getUserByAccessToken(accessToken: string): Promise<AuthUser | null>;
  signOut(accessToken?: string): Promise<void>;
}

export class AuthService {
  constructor(private readonly provider: AuthProvider) {}

  signIn(credentials: AuthCredentials) {
    return this.provider.signIn(credentials);
  }

  signUp(credentials: AuthCredentials) {
    return this.provider.signUp(credentials);
  }

  getSession() {
    return this.provider.getSession();
  }

  refreshSession(refreshToken: string) {
    return this.provider.refreshSession(refreshToken);
  }

  getUserByAccessToken(accessToken: string) {
    return this.provider.getUserByAccessToken(accessToken);
  }

  signOut(accessToken?: string) {
    return this.provider.signOut(accessToken);
  }
}

type SupabaseAuthConfig = {
  supabaseUrl: string;
  supabasePublishableKey: string;
};

function toUser(input: {
  id: string;
  email?: string | null;
  user_metadata?: { full_name?: string; avatar_url?: string };
}): AuthUser {
  return {
    id: input.id,
    email: input.email ?? "",
    displayName: input.user_metadata?.full_name ?? "User",
    avatarUrl: input.user_metadata?.avatar_url ?? null
  };
}

export function createSupabaseAuthProvider(config: SupabaseAuthConfig): AuthProvider {
  const client = createClient(config.supabaseUrl, config.supabasePublishableKey);

  return {
    async signIn(credentials: AuthCredentials): Promise<AuthSession> {
      const { data, error } = await client.auth.signInWithPassword(credentials);
      if (error || !data.session || !data.user) {
        throw new Error(error?.message ?? "Invalid credentials");
      }
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? null,
        user: toUser(data.user)
      };
    },
    async signUp(credentials: AuthCredentials): Promise<AuthSession> {
      const { data, error } = await client.auth.signUp(credentials);
      if (error || !data.session || !data.user) {
        throw new Error(error?.message ?? "Could not register user");
      }
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? null,
        user: toUser(data.user)
      };
    },
    async getSession(): Promise<AuthSession | null> {
      const { data } = await client.auth.getSession();
      if (!data.session || !data.session.user || !data.session.access_token) return null;
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? null,
        user: toUser(data.session.user)
      };
    },
    async refreshSession(refreshToken: string): Promise<AuthSession> {
      const { data, error } = await client.auth.refreshSession({ refresh_token: refreshToken });
      if (error || !data.session || !data.session.user) {
        throw new Error(error?.message ?? "Could not refresh session");
      }
      return {
        accessToken: data.session.access_token,
        refreshToken: data.session.refresh_token ?? null,
        user: toUser(data.session.user)
      };
    },
    async getUserByAccessToken(accessToken: string): Promise<AuthUser | null> {
      const { data, error } = await client.auth.getUser(accessToken);
      if (error || !data.user) return null;
      return toUser(data.user);
    },
    async signOut(): Promise<void> {
      await client.auth.signOut();
    }
  };
}

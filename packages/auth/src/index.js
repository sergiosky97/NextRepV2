import { createClient } from "@supabase/supabase-js";
export class AuthService {
    provider;
    constructor(provider) {
        this.provider = provider;
    }
    signIn(credentials) {
        return this.provider.signIn(credentials);
    }
    getSession() {
        return this.provider.getSession();
    }
    getUserByAccessToken(accessToken) {
        return this.provider.getUserByAccessToken(accessToken);
    }
    signOut() {
        return this.provider.signOut();
    }
}
function toUser(input) {
    return {
        id: input.id,
        email: input.email ?? "",
        displayName: input.user_metadata?.full_name ?? "User",
        avatarUrl: input.user_metadata?.avatar_url ?? null
    };
}
export function createSupabaseAuthProvider(config) {
    const client = createClient(config.supabaseUrl, config.supabasePublishableKey);
    return {
        async signIn(credentials) {
            const { data, error } = await client.auth.signInWithPassword(credentials);
            if (error || !data.session || !data.user) {
                throw new Error(error?.message ?? "Invalid credentials");
            }
            return {
                accessToken: data.session.access_token,
                user: toUser(data.user)
            };
        },
        async getSession() {
            const { data } = await client.auth.getSession();
            if (!data.session || !data.session.user || !data.session.access_token)
                return null;
            return {
                accessToken: data.session.access_token,
                user: toUser(data.session.user)
            };
        },
        async getUserByAccessToken(accessToken) {
            const { data, error } = await client.auth.getUser(accessToken);
            if (error || !data.user)
                return null;
            return toUser(data.user);
        },
        async signOut() {
            await client.auth.signOut();
        }
    };
}

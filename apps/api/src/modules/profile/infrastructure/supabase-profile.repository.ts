import { Injectable } from "@nestjs/common";
import { createClient } from "@supabase/supabase-js";
import { ProfileRepositoryPort } from "../application/profile.repository.port";
import { ProfileEntity } from "../domain/profile.entity";

@Injectable()
export class SupabaseProfileRepository implements ProfileRepositoryPort {
  private readonly client = createClient(
    process.env.SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      "https://qwlgnncpubwpfzlbgrqn.supabase.co",
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      "sb_publishable_jZs9AYbkJ0lHEDwx9uS23w_TKqF5qIM"
  );

  async getByUserId(userId: string): Promise<ProfileEntity | null> {
    const { data, error } = await this.client
      .from("profiles")
      .select("user_id, display_name, bio")
      .eq("user_id", userId)
      .single();

    if (error || !data) return null;

    return {
      userId: data.user_id,
      displayName: data.display_name,
      bio: data.bio
    };
  }
}

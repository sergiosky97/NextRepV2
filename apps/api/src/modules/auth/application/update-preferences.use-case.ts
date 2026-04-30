import { Injectable } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class UpdatePreferencesUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  execute(
    accessToken: string,
    payload: { themeMode?: "light" | "dark"; language?: string; avatarUrl?: string | null }
  ) {
    return this.authProvider.updatePreferences(accessToken, payload);
  }
}

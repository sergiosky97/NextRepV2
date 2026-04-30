import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class RefreshSessionUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  async execute(refreshToken: string) {
    try {
      return await this.authProvider.refreshSession(refreshToken);
    } catch {
      throw new UnauthorizedException("Could not refresh session");
    }
  }
}

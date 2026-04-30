import { Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class GetMeUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  async execute(accessToken: string) {
    const user = await this.authProvider.getUserByAccessToken(accessToken);
    if (!user) throw new UnauthorizedException("Unauthorized");
    return user;
  }
}

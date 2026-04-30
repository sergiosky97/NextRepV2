import { Injectable } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class LogoutUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  execute(accessToken: string) {
    return this.authProvider.signOut(accessToken);
  }
}

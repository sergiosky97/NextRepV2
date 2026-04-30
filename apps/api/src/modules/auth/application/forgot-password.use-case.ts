import { Injectable } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class ForgotPasswordUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  execute(emailOrPhone: string) {
    return this.authProvider.requestPasswordReset(emailOrPhone);
  }
}

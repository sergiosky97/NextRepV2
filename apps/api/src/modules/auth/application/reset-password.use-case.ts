import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthProviderPort } from "./auth-provider.port";

@Injectable()
export class ResetPasswordUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  async execute(token: string, newPassword: string) {
    try {
      await this.authProvider.resetPassword(token, newPassword);
      return { success: true };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "No se pudo restablecer la contrasena"
      );
    }
  }
}

import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthProviderPort, LoginCommand } from "./auth-provider.port";

@Injectable()
export class LoginUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  async execute(command: LoginCommand) {
    try {
      return await this.authProvider.signIn(command);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Invalid credentials"
      );
    }
  }
}

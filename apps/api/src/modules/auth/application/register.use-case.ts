import { BadRequestException, Injectable } from "@nestjs/common";
import { AuthProviderPort, LoginCommand } from "./auth-provider.port";

@Injectable()
export class RegisterUseCase {
  constructor(private readonly authProvider: AuthProviderPort) {}

  async execute(command: LoginCommand) {
    try {
      return await this.authProvider.signUp(command);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : "Could not register user"
      );
    }
  }
}

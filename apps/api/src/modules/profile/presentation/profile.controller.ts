import { Controller, Get, Param } from "@nestjs/common";
import { GetProfileUseCase } from "../application/get-profile.use-case";

@Controller("profiles")
export class ProfileController {
  constructor(private readonly getProfileUseCase: GetProfileUseCase) {}

  @Get(":userId")
  getOne(@Param("userId") userId: string) {
    return this.getProfileUseCase.execute(userId);
  }
}

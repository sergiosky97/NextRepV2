import {
  Body,
  Controller,
  Get,
  Headers,
  Patch,
  Post,
  UnauthorizedException
} from "@nestjs/common";
import { z } from "zod";
import { GetMeUseCase } from "../application/get-me.use-case";
import { ForgotPasswordUseCase } from "../application/forgot-password.use-case";
import { LoginUseCase } from "../application/login.use-case";
import { LogoutUseCase } from "../application/logout.use-case";
import { RefreshSessionUseCase } from "../application/refresh-session.use-case";
import { RegisterUseCase } from "../application/register.use-case";
import { ResetPasswordUseCase } from "../application/reset-password.use-case";
import { UpdatePreferencesUseCase } from "../application/update-preferences.use-case";

const authSchema = z
  .object({
    email: z.string().email().optional(),
    phone: z.string().min(8).optional(),
    password: z.string().min(6),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional()
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Email o telefono es obligatorio"
  });
const refreshSchema = z.object({ refreshToken: z.string().min(1) });
const forgotPasswordSchema = z.object({ emailOrPhone: z.string().min(3) });
const resetPasswordSchema = z.object({
  token: z.string().min(1),
  newPassword: z.string().min(6)
});
const preferencesSchema = z.object({
  themeMode: z.enum(["light", "dark"]).optional(),
  language: z.string().min(2).optional(),
  avatarUrl: z.string().url().nullable().optional()
});

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUseCase,
    private readonly refreshSessionUseCase: RefreshSessionUseCase,
    private readonly logoutUseCase: LogoutUseCase,
    private readonly forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
    private readonly updatePreferencesUseCase: UpdatePreferencesUseCase,
    private readonly getMeUseCase: GetMeUseCase
  ) {}

  @Post("login")
  async login(@Body() payload: unknown) {
    const data = authSchema.parse(payload);
    return this.loginUseCase.execute(data);
  }

  @Post("register")
  async register(@Body() payload: unknown) {
    const data = authSchema.parse(payload);
    return this.registerUseCase.execute(data);
  }

  @Get("me")
  async me(@Headers("authorization") authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing access token");
    }
    return this.getMeUseCase.execute(authorization.replace("Bearer ", ""));
  }

  @Post("refresh")
  async refresh(@Body() payload: unknown) {
    const data = refreshSchema.parse(payload);
    return this.refreshSessionUseCase.execute(data.refreshToken);
  }

  @Post("logout")
  async logout(@Headers("authorization") authorization?: string) {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing access token");
    }
    await this.logoutUseCase.execute(authorization.replace("Bearer ", ""));
    return { success: true };
  }

  @Post("forgot-password")
  async forgotPassword(@Body() payload: unknown) {
    const data = forgotPasswordSchema.parse(payload);
    return this.forgotPasswordUseCase.execute(data.emailOrPhone);
  }

  @Post("reset-password")
  async resetPassword(@Body() payload: unknown) {
    const data = resetPasswordSchema.parse(payload);
    return this.resetPasswordUseCase.execute(data.token, data.newPassword);
  }

  @Patch("preferences")
  async updatePreferences(
    @Headers("authorization") authorization: string | undefined,
    @Body() payload: unknown
  ) {
    if (!authorization?.startsWith("Bearer ")) {
      throw new UnauthorizedException("Missing access token");
    }
    const data = preferencesSchema.parse(payload);
    return this.updatePreferencesUseCase.execute(authorization.replace("Bearer ", ""), data);
  }
}

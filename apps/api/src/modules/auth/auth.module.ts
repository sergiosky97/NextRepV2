import { Module } from "@nestjs/common";
import { AuthProviderPort } from "./application/auth-provider.port";
import { ForgotPasswordUseCase } from "./application/forgot-password.use-case";
import { GetMeUseCase } from "./application/get-me.use-case";
import { LoginUseCase } from "./application/login.use-case";
import { LogoutUseCase } from "./application/logout.use-case";
import { RefreshSessionUseCase } from "./application/refresh-session.use-case";
import { RegisterUseCase } from "./application/register.use-case";
import { ResetPasswordUseCase } from "./application/reset-password.use-case";
import { UpdatePreferencesUseCase } from "./application/update-preferences.use-case";
import { PostgresAuthProvider } from "./infrastructure/postgres-auth.provider";
import { AuthController } from "./presentation/auth.controller";

@Module({
  controllers: [AuthController],
  providers: [
    PostgresAuthProvider,
    {
      provide: "AuthProviderPort",
      useExisting: PostgresAuthProvider
    },
    {
      provide: LoginUseCase,
      useFactory: (provider: AuthProviderPort) => new LoginUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: GetMeUseCase,
      useFactory: (provider: AuthProviderPort) => new GetMeUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: RegisterUseCase,
      useFactory: (provider: AuthProviderPort) => new RegisterUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: RefreshSessionUseCase,
      useFactory: (provider: AuthProviderPort) => new RefreshSessionUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: LogoutUseCase,
      useFactory: (provider: AuthProviderPort) => new LogoutUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: ForgotPasswordUseCase,
      useFactory: (provider: AuthProviderPort) => new ForgotPasswordUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: ResetPasswordUseCase,
      useFactory: (provider: AuthProviderPort) => new ResetPasswordUseCase(provider),
      inject: ["AuthProviderPort"]
    },
    {
      provide: UpdatePreferencesUseCase,
      useFactory: (provider: AuthProviderPort) => new UpdatePreferencesUseCase(provider),
      inject: ["AuthProviderPort"]
    }
  ]
})
export class AuthModule {}

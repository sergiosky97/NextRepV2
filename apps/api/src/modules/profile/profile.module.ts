import { Module } from "@nestjs/common";
import { GetProfileUseCase } from "./application/get-profile.use-case";
import { ProfileRepositoryPort } from "./application/profile.repository.port";
import { SupabaseProfileRepository } from "./infrastructure/supabase-profile.repository";
import { ProfileController } from "./presentation/profile.controller";

@Module({
  controllers: [ProfileController],
  providers: [
    SupabaseProfileRepository,
    {
      provide: "ProfileRepositoryPort",
      useExisting: SupabaseProfileRepository
    },
    {
      provide: GetProfileUseCase,
      useFactory: (repo: ProfileRepositoryPort) => new GetProfileUseCase(repo),
      inject: ["ProfileRepositoryPort"]
    }
  ]
})
export class ProfileModule {}

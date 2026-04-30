import { ProfileRepositoryPort } from "./profile.repository.port";

export class GetProfileUseCase {
  constructor(private readonly repo: ProfileRepositoryPort) {}

  execute(userId: string) {
    return this.repo.getByUserId(userId);
  }
}

import { ProfileEntity } from "../domain/profile.entity";

export interface ProfileRepositoryPort {
  getByUserId(userId: string): Promise<ProfileEntity | null>;
}

import DataLoader from 'dataloader';
import { User } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositories/user.repository';

export function createUserLoader(
  userRepository: UserRepository,
): DataLoader<number, User | null> {
  return new DataLoader<number, User | null>(
    async (userIds: readonly number[]) => {
      const users = await userRepository.findByIds([...userIds]);
      const map = new Map<number, User>(users.map((u) => [u.id, u]));
      return userIds.map((id) => map.get(id) ?? null);
    },
    { cache: true },
  );
}

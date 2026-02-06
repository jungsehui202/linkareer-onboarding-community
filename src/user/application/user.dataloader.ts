import { User } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';

export function createUserLoader(
  prisma: PrismaService,
): DataLoader<number, User | null> {
  return new DataLoader<number, User | null>(
    async (userIds: readonly number[]) => {
      const users = await prisma.user.findMany({
        where: {
          id: { in: [...userIds] },
          isDeleted: false,
        },
      });

      const userMap = new Map<number, User>(
        users.map((user) => [user.id, user]),
      );

      return userIds.map((id) => userMap.get(id) ?? null);
    },
    {
      cache: true,
    },
  );
}

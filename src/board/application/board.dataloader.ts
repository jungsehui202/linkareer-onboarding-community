import { Board } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';

export function createBoardLoader(
  prisma: PrismaService,
): DataLoader<number, Board | null> {
  return new DataLoader<number, Board | null>(
    async (boardIds: readonly number[]) => {
      const boards = await prisma.board.findMany({
        where: {
          id: { in: [...boardIds] },
        },
      });

      const boardMap = new Map<number, Board>(
        boards.map((board) => [board.id, board]),
      );

      return boardIds.map((id) => boardMap.get(id) ?? null);
    },
    {
      cache: true,
    },
  );
}

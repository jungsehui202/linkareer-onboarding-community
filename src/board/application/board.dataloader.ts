import { Board } from '@prisma/client';
import DataLoader from 'dataloader';
import { PrismaService } from '../../prisma/prisma.service';

export function createBoardLoader(
  prisma: PrismaService,
): DataLoader<number, Board | null> {
  return new DataLoader<number, Board | null>(
    async (boardIds: readonly number[]) => {
      const boards = await prisma.board.findMany({
        where: { id: { in: [...boardIds] } },
      });

      const boardMap = new Map<number, Board>(
        boards.map((board) => [board.id, board]),
      );

      return boardIds.map((id) => boardMap.get(id) ?? null);
    },
    { cache: true },
  );
}

export function createChildBoardsLoader(
  prisma: PrismaService,
): DataLoader<number, Board[]> {
  return new DataLoader<number, Board[]>(
    async (parentIds: readonly number[]) => {
      // 1. 모든 자식 게시판 조회
      const allChildBoards = await prisma.board.findMany({
        where: { parentId: { in: [...parentIds] } },
        orderBy: { id: 'asc' },
      });

      // 2. parentId별로 그룹핑
      const boardsByParentId = new Map<number, Board[]>();

      parentIds.forEach((parentId) => {
        boardsByParentId.set(parentId, []);
      });

      allChildBoards.forEach((board) => {
        if (board.parentId) {
          const children = boardsByParentId.get(board.parentId) || [];
          children.push(board);
          boardsByParentId.set(board.parentId, children);
        }
      });

      // 3. 요청 순서대로 반환
      return parentIds.map((id) => boardsByParentId.get(id) || []);
    },
    { cache: true },
  );
}

export function createPostCountLoader(
  prisma: PrismaService,
): DataLoader<number, number> {
  return new DataLoader<number, number>(
    async (boardIds: readonly number[]) => {
      // 1. 게시글 수 집계 (groupBy)
      const counts = await prisma.post.groupBy({
        by: ['boardId'],
        where: { boardId: { in: [...boardIds] } },
        _count: { id: true },
      });

      // 2. Map으로 변환
      const countMap = new Map<number, number>(
        counts.map((c) => [c.boardId, c._count.id]),
      );

      // 3. 요청 순서대로 반환 (없으면 0)
      return boardIds.map((id) => countMap.get(id) || 0);
    },
    { cache: true },
  );
}

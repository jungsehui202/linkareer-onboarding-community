import DataLoader from 'dataloader';
import { Board } from '../../domain/entities/board.entity';
import { BoardRepository } from '../../domain/repositories/board.repository';

export function createBoardLoader(
  boardRepository: BoardRepository,
): DataLoader<number, Board | null> {
  return new DataLoader<number, Board | null>(
    async (ids: readonly number[]) => {
      const boards = await boardRepository.findByIds([...ids]);
      const map = new Map<number, Board>(boards.map((b) => [b.id, b]));
      return ids.map((id) => map.get(id) ?? null);
    },
    { cache: true },
  );
}

export function createChildBoardsLoader(
  boardRepository: BoardRepository,
): DataLoader<number, Board[]> {
  return new DataLoader<number, Board[]>(
    async (parentIds: readonly number[]) => {
      const grouped = await boardRepository.findChildrenOfMany([...parentIds]);
      return parentIds.map((id) => grouped.get(id) ?? []);
    },
    { cache: true },
  );
}

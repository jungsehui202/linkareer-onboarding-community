import { Board, User } from '@prisma/client'; // 향후 도메인 엔티티로 교체
import DataLoader from 'dataloader';

export interface IDataLoaders {
  userLoader: DataLoader<number, User | null>;
  boardLoader: DataLoader<number, Board | null>;
  childBoardsLoader: DataLoader<number, Board[]>;
  postCountLoader: DataLoader<number, number>;
}

import DataLoader from 'dataloader';
import { Board } from '../../board/domain/entities/board.entity';
import { User } from '../../user/domain/entities/user.entity';

export interface IDataLoaders {
  userLoader: DataLoader<number, User | null>;
  boardLoader: DataLoader<number, Board | null>;
  childBoardsLoader: DataLoader<number, Board[]>;
  postCountLoader: DataLoader<number, number>;
}

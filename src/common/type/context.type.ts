import { Board, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { Request } from 'express';

export interface GraphQLContext {
  req: Request;
  user?: User;
  loaders: {
    userLoader: DataLoader<number, User | null>;
    boardLoader: DataLoader<number, Board | null>;
  };
}

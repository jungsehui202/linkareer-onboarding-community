import { Board, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { Request as ExpressRequest } from 'express';

export interface GraphQLRequest extends ExpressRequest {
  user?: User;
}

export interface GraphQLContext {
  req: GraphQLRequest;
  user?: User;
  loaders: {
    userLoader: DataLoader<number, User | null>;
    boardLoader: DataLoader<number, Board | null>;
    childBoardsLoader: DataLoader<number, Board[]>;
    postCountLoader: DataLoader<number, number>;
  };
}

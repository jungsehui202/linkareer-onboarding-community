import { Board, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { Request } from 'express';

export interface GraphQLContext {
  req: Request;
  user?: User; // JWT 인증 후 주입됨
  loaders?: {
    userLoader?: DataLoader<number, User | null>;
    boardLoader?: DataLoader<number, Board | null>;
    childBoardsLoader?: DataLoader<number, Board[]>;
    postCountLoader?: DataLoader<number, number>;
    createPostCountLoader?: DataLoader<number, number>;
  };
}

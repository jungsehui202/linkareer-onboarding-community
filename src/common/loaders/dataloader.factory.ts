import { Inject, Injectable } from '@nestjs/common';
import {
  BOARD_REPOSITORY,
  BoardRepository,
} from '../../board/domain/repositories/board.repository';
import {
  createBoardLoader,
  createChildBoardsLoader,
} from '../../board/infrastructure/persistence/board.dataloader';
import {
  POST_REPOSITORY,
  PostRepository,
} from '../../post/domain/repositories/post.repository';
import { createPostCountByBoardLoader } from '../../post/infrastructure/persistence/post.dataloader';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../user/domain/repositories/user.repository';
import { createUserLoader } from '../../user/infrastructure/persistence/user.dataloader';
import { IDataLoaders } from './dataloader.interface';

@Injectable()
export class DataLoaderFactory {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(BOARD_REPOSITORY)
    private readonly boardRepository: BoardRepository,
    @Inject(POST_REPOSITORY)
    private readonly postRepository: PostRepository,
  ) {}

  create(): IDataLoaders {
    return {
      userLoader: createUserLoader(this.userRepository),
      boardLoader: createBoardLoader(this.boardRepository),
      childBoardsLoader: createChildBoardsLoader(this.boardRepository),
      postCountLoader: createPostCountByBoardLoader(this.postRepository),
    };
  }
}

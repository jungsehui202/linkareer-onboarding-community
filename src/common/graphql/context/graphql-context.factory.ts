import { Injectable } from '@nestjs/common';
import { DataLoaderFactory } from '../../loaders/dataloader.factory';
import { GraphQLContext, GraphQLRequest } from './graphqh-context.interface';

@Injectable()
export class GraphQLContextFactory {
  constructor(private readonly loaderFactory: DataLoaderFactory) {}

  create(req: GraphQLRequest): GraphQLContext {
    return {
      req,
      user: req.user,
      loaders: this.loaderFactory.create(), // 의존성 주입받은 팩토리 사용
    };
  }
}

import { Request as ExpressRequest } from 'express';
import { User } from '../../../user/domain/entities/user.entity';
import { IDataLoaders } from '../../loaders/dataloader.interface';

export interface GraphQLRequest extends ExpressRequest {
  user?: User;
}

export interface GraphQLContext {
  req: GraphQLRequest;
  user?: User;
  loaders: IDataLoaders;
}

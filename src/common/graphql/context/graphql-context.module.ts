import { Module } from '@nestjs/common';
import { DataLoaderModule } from '../../loaders/dataloader.module';
import { GraphQLContextFactory } from './graphql-context.factory';

@Module({
  imports: [DataLoaderModule],
  providers: [GraphQLContextFactory],
  exports: [GraphQLContextFactory],
})
export class GraphQLContextModule {}

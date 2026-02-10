import { Module } from '@nestjs/common';
import { PrismaModule } from '../../../prisma/prisma.module';
import { DataLoaderModule } from '../../loaders/dataloader.module';
import { GraphQLContextFactory } from './graphql-context.factory';

@Module({
  imports: [PrismaModule, DataLoaderModule],
  providers: [GraphQLContextFactory],
  exports: [GraphQLContextFactory],
})
export class GraphQLContextModule {}

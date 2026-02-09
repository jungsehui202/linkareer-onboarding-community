import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { GraphQLContextFactory } from './context/graphql-context.factory';
import { GraphQLContextModule } from './context/graphql-context.module';

@Module({
  imports: [
    GraphQLContextModule,
    NestGraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [GraphQLContextModule],
      inject: [ConfigService, GraphQLContextFactory],
      useFactory: (config, contextFactory) => ({
        autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: config.get('NODE_ENV') !== 'production',
        introspection: config.get('NODE_ENV') !== 'production',
        context: ({ req }) => contextFactory.create(req),
      }),
    }),
  ],
})
export class GraphQLModule {}

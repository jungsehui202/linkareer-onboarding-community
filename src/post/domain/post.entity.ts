import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Post as PrismaPost } from '@prisma/client';

@ObjectType()
export class Post implements PrismaPost {
  @Field(() => Int)
  id: number;

  @Field()
  title: string;

  @Field()
  content: string;

  @Field(() => Int)
  viewCount: number;

  @Field(() => Int)
  scrapCount: number;

  @Field(() => Int, { nullable: true })
  authorId: number | null;

  @Field(() => Int)
  boardId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

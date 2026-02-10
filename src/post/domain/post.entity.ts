import { Field, Float, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Post {
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

  @Field(() => Int)
  searchCount: number;

  @Field(() => Int)
  popularityScore: number;

  @Field({ nullable: true })
  deletedAt: Date | null;

  @Field(() => Int, { nullable: true })
  authorId: number | null;

  @Field(() => Int)
  boardId: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => Float, { nullable: true })
  rank?: number;
}

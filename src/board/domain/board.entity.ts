import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board as PrismaBoard, UserRole } from '@prisma/client';

@ObjectType()
export class Board implements PrismaBoard {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description: string | null;

  @Field(() => Int, { nullable: true })
  parentId: number | null;

  @Field(() => UserRole)
  requiredRole: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

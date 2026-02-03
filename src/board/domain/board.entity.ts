import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Board as PrismaBoard, UserRole } from '@prisma/client';

// BoardEntity (GraphQL + Domain)
// Prisma Board 타입과 호환
@ObjectType()
export class BoardEntity implements PrismaBoard {
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

  // Prisma Board → BoardEntity 변환
  static fromPrisma(prismaBoard: PrismaBoard): BoardEntity {
    const entity = new BoardEntity();
    Object.assign(entity, prismaBoard);
    return entity;
  }
}

export { UserRole };

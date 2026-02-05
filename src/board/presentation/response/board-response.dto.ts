import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { BoardEntity } from '../../domain/board.entity';

@ObjectType()
export class BoardResponse {
  @Field(() => Int)
  id: number;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => UserRole)
  requiredRole: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  static from(board: BoardEntity): BoardResponse {
    const response = new BoardResponse();
    response.id = board.id;
    response.name = board.name;
    response.slug = board.slug;
    response.description = board.description;
    response.parentId = board.parentId;
    response.requiredRole = board.requiredRole;
    response.createdAt = board.createdAt;
    response.updatedAt = board.updatedAt;

    return response;
  }

  static fromList(boards: BoardEntity[]): BoardResponse[] {
    return boards.map((board) => BoardResponse.from(board));
  }
}

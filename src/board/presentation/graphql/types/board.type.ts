import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../../../user/presentation/graphql/types/user-role.type';

@ObjectType('Board')
export class BoardView {
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

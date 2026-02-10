import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserRole } from '../../user/domain/user.entity';

@ObjectType()
export class Board {
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

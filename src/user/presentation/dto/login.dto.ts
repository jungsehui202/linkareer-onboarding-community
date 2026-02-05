import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../../domain/user.entity';

@ObjectType()
export class LoginDto {
  @Field(() => User)
  user: User;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

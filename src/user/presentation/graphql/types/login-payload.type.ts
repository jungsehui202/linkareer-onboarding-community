import { Field, ObjectType } from '@nestjs/graphql';
import { UserView } from './user.type';

@ObjectType('LoginDto')
export class LoginPayloadView {
  @Field(() => UserView)
  user: UserView;

  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

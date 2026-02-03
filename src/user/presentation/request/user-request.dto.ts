import { Field, InputType, Int } from '@nestjs/graphql';
import { IsEmail, Matches, MaxLength, MinLength } from 'class-validator';
import { UserRole } from '../../domain/user.entity';

@InputType()
export class CreateUserRequest {
  @Field()
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @Field()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,30}$/,
    {
      message:
        '비밀번호는 8~30자의 영어 대소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @Field()
  @MinLength(1, { message: '이름을 입력해 주세요.' })
  @MaxLength(20, { message: '이름은 최대 20자까지 입력할 수 있습니다.' })
  name: string;

  @Field(() => UserRole, { defaultValue: UserRole.USER })
  userRole: UserRole;
}

@InputType()
export class UpdateUserRequest {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @MaxLength(20)
  name?: string;
}

@InputType()
export class LoginRequest {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  password: string;
}

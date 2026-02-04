import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

registerEnumType(UserRole, { name: 'UserRole' });

@InputType()
export class CreateUserInput {
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
  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @MinLength(1)
  @MaxLength(20, { message: '이름은 최대 20자까지 입력할 수 있습니다.' })
  name: string;

  @Field(() => UserRole, { defaultValue: UserRole.USER })
  userRole: UserRole;
}

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @MinLength(1)
  @MaxLength(20)
  name?: string;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsNotEmpty()
  password: string;
}

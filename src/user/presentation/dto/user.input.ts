import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

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
  @IsEnum(UserRole, { message: '올바른 사용자 권한이 아닙니다.' })
  userRole: UserRole;
}

// UpdateUserInput
//
// PickType: CreateUserInput에서 'name'만 선택
// PartialType: 선택된 필드를 모두 optional로 변경
//
// 결과: { name?: string } + { id: number }
@InputType()
export class UpdateUserInput extends PartialType(
  PickType(CreateUserInput, ['name'] as const),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}

@InputType()
export class LoginInput {
  @Field()
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @Field()
  @IsNotEmpty({ message: '비밀번호를 입력해 주세요.' })
  password: string;
}

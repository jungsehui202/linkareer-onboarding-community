import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsEmail({}, { message: '올바른 이메일 형식이 아닙니다.' })
  email: string;

  @Field()
  @MinLength(8, { message: '비밀번호는 최소 8자 이상이어야 합니다.' })
  @MaxLength(30, { message: '비밀번호는 최대 30자까지 가능합니다.' })
  password: string;

  @Field()
  @IsNotEmpty({ message: '이름을 입력해 주세요.' })
  @MaxLength(20, { message: '이름은 최대 20자까지 입력할 수 있습니다.' })
  name: string;

  @Field(() => UserRole)
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

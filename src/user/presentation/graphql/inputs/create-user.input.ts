import { Field, InputType } from '@nestjs/graphql';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../types/user-role.type';

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

import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class BoardFilterInput {
  @Field(() => UserRole, { nullable: true })
  @IsOptional()
  @IsEnum(UserRole, { message: '올바른 사용자 권한이 아닙니다.' })
  userRole?: UserRole;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt({ message: '부모 게시판 ID는 정수여야 합니다.' })
  parentId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'slug는 문자열이어야 합니다.' })
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: '검색어는 문자열이어야 합니다.' })
  @MinLength(2, { message: '검색어는 최소 2자 이상이어야 합니다.' })
  searchKeyword?: string;
}

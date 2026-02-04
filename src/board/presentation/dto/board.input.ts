import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator'; // 추가

@InputType()
export class BoardFilterInput {
  @Field(() => UserRole, { nullable: true })
  @IsOptional() // 추가
  @IsEnum(UserRole) // 추가 (Enum 검증)
  userRole?: UserRole;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  parentId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchKeyword?: string;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, Matches, MaxLength } from 'class-validator';

@InputType()
export class CreateBoardRequest {
  @Field()
  @IsNotEmpty({ message: '게시판 이름을 입력해 주세요.' })
  @MaxLength(50, { message: '게시판 이름은 최대 50자까지 입력할 수 있습니다.' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Slug를 입력해 주세요.' })
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug는 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.',
  })
  slug: string;

  @Field({ nullable: true })
  @MaxLength(200, { message: '설명은 최대 200자까지 입력할 수 있습니다.' })
  description?: string;

  @Field(() => Int, { nullable: true })
  parentId?: number;

  @Field(() => UserRole, { defaultValue: UserRole.USER })
  requiredRole: UserRole;
}

@InputType()
export class UpdateBoardRequest {
  @Field(() => Int)
  id: number;

  @Field({ nullable: true })
  @MaxLength(50)
  name?: string;

  @Field({ nullable: true })
  @MaxLength(200)
  description?: string;

  @Field(() => UserRole, { nullable: true })
  requiredRole?: UserRole;
}

import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

// CreatePostInput (게시글 작성)
@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  @MinLength(2, { message: '제목은 최소 2자 이상이어야 합니다.' })
  @MaxLength(100, { message: '제목은 최대 100자까지 입력할 수 있습니다.' })
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  @MinLength(10, { message: '내용은 최소 10자 이상이어야 합니다.' })
  content: string;

  @Field(() => Int)
  @IsInt()
  boardId: number;

  @Field(() => Int)
  @IsInt()
  authorId: number;
}

// UpdatePostInput (게시글 수정)
@InputType()
export class UpdatePostInput {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  title?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  boardId?: number;
}

// PostFilterInput (게시글 목록 필터링)
@InputType()
export class PostFilterInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  boardId?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  authorId?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  searchKeyword?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minViewCount?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  minScrapCount?: number;

  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1)
  take?: number = 20;
}

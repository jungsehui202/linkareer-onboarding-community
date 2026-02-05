import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from '../../../common/dto/pagination.input';
import { PostSortInput } from '../../../common/dto/sort.input';

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
  @IsInt({ message: '게시판 ID는 정수여야 합니다.' })
  boardId: number;

  @Field(() => Int)
  @IsInt({ message: '작성자 ID는 정수여야 합니다.' })
  authorId: number;
}

// UpdatePostInput
//
// 동작:
// 1. PickType으로 CreatePostInput에서 ['title', 'content', 'boardId'] 선택
// 2. PartialType으로 선택된 필드를 모두 optional로 변경
// 3. id 필드 추가
//
// 결과: { id: number, title?: string, content?: string, boardId?: number }
//
// CreatePostInput이 변경되면 자동으로 반영됨:
// - title 검증 규칙 변경 → UpdatePostInput에도 자동 적용
// - 새 필드 추가 시 PickType에 추가하면 자동 반영
@InputType()
export class UpdatePostInput extends PartialType(
  PickType(CreatePostInput, ['title', 'content', 'boardId'] as const),
) {
  @Field(() => Int)
  @IsInt()
  @IsNotEmpty()
  id: number;
}

// Post Filter Input (Pagination + Sort 통합)
//
// PostFilterInput
//
// extends PaginationInput:
// - skip?: number (기본값: 0)
// - take?: number (기본값: 20)
//
// 추가 필터:
// - boardId, authorId, searchKeyword, minViewCount, minScrapCount
// - sort: PostSortInput (정렬 옵션)
@InputType()
export class PostFilterInput extends PaginationInput {
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
  @MinLength(2, { message: '검색어는 최소 2자 이상이어야 합니다.' })
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

  @Field(() => PostSortInput, { nullable: true })
  @IsOptional()
  @ValidateNested()
  @Type(() => PostSortInput)
  sort?: PostSortInput;
}

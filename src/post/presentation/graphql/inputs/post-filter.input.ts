import { Field, InputType, Int } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { PaginationInput } from '../../../../common/dto/pagination.input';
import { PostSortInput } from '../../../../common/dto/sort.input';

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

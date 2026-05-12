import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsInt,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

@InputType()
export class CreatePostInput {
  @Field()
  @IsString()
  @IsNotEmpty({ message: '제목을 입력해 주세요.' })
  @MinLength(2)
  @MaxLength(100)
  title: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: '내용을 입력해 주세요.' })
  @MinLength(10)
  content: string;

  @Field(() => Int)
  @IsInt({ message: '게시판 ID는 정수여야 합니다.' })
  boardId: number;
}

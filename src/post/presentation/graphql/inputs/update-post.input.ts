import { Field, InputType, Int, PartialType, PickType } from '@nestjs/graphql';
import { IsInt } from 'class-validator';
import { CreatePostInput } from './create-post.input';

@InputType()
export class UpdatePostInput extends PartialType(
  PickType(CreatePostInput, ['title', 'content', 'boardId'] as const),
) {
  @Field(() => Int)
  @IsInt()
  id: number;
}

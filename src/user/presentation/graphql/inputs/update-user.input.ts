import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, MaxLength, MinLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
  @Field(() => Int)
  @IsInt()
  id: number;

  @Field({ nullable: true })
  @IsOptional()
  @MinLength(1)
  @MaxLength(20, { message: '이름은 최대 20자까지 입력할 수 있습니다.' })
  name?: string;
}

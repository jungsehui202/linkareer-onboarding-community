import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  @IsOptional()
  @IsInt()
  @Min(0, { message: 'skip은 0 이상이어야 합니다.' })
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 20 })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'take는 최소 1 이상이어야 합니다.' })
  @Max(100, { message: 'take는 최대 100까지 가능합니다.' })
  take?: number = 20;
}

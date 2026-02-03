import { Field, Int, ObjectType } from '@nestjs/graphql';
import { User as PrismaUser, UserRole } from '@prisma/client';
import { Password } from '../../common/vo/password.vo';
import { UserInvalidPasswordException } from '../exception/user.exception';

// UserEntity (GraphQL + Domain)
// Prisma User 타입과 호환
// 도메인 로직 포함
@ObjectType()
export class UserEntity implements PrismaUser {
  @Field(() => Int)
  id: number;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field(() => UserRole)
  userRole: UserRole;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Prisma 필드 (GraphQL 노출 안 함)
  password: string;
  subscribeEmail: boolean;
  subscribeSMS: boolean;
  isDeleted: boolean;
  deletedAt: Date | null;

  // Prisma User → UserEntity 변환
  static fromPrisma(prismaUser: PrismaUser): UserEntity {
    const entity = new UserEntity();
    Object.assign(entity, prismaUser);
    return entity;
  }

  // 로그인 검증 (도메인 로직)
  login(plainPassword: string): void {
    const passwordVO = Password.fromHashed(this.password);

    if (!passwordVO.match(plainPassword)) {
      throw new UserInvalidPasswordException();
    }
  }
}

export { UserRole };

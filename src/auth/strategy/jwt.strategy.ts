import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlError } from '../../common/exception/gql-error.helper';
import { PrismaService } from '../../prisma/prisma.service';

export interface JwtPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'tmp-secret-key',
    });
  }

  async validate(payload: JwtPayload) {
    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub, isDeleted: false },
    });

    if (!user) {
      throw GqlError.notFound('User not found', {
        userId: payload.sub,
      });
    }

    // user 객체 반환 (req.user에 저장됨)
    return user;
  }
}

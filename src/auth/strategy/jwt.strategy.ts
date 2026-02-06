import {
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlError } from '../../common/exception/gql-error.helper';
import { PrismaService } from '../../prisma/prisma.service';
import { GqlExecutionContext } from '@nestjs/graphql';

export interface JwtPayload {
  sub: number; // User ID
  email: string;
  role: string;
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
      throw GqlError.notFound('User not found !!', {
        payload,
      });
    }

    return user; // Request에 user 추가
  }
}

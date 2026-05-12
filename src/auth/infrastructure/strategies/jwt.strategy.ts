import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { GqlError } from '../../../common/exception/gql-error.helper';
import { User } from '../../../user/domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepository,
} from '../../../user/domain/repositories/user.repository';
import { TokenPayload } from '../../application/ports/token-issuer.port';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET') || 'tmp-secret-key',
    });
  }

  async validate(payload: TokenPayload): Promise<User> {
    const user = await this.userRepository.findById(payload.sub);

    if (!user || user.isDeleted) {
      throw GqlError.notFound('User not found', { userId: payload.sub });
    }

    return user;
  }
}

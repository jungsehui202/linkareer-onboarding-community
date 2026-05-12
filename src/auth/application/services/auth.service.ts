import { Inject, Injectable } from '@nestjs/common';
import { User } from '../../../user/domain/entities/user.entity';
import { TOKEN_ISSUER, TokenIssuer } from '../ports/token-issuer.port';

@Injectable()
export class AuthService {
  constructor(
    @Inject(TOKEN_ISSUER)
    private readonly tokenIssuer: TokenIssuer,
  ) {}

  issueAccessToken(user: User): string {
    return this.tokenIssuer.signAccessToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }

  issueRefreshToken(user: User): string {
    return this.tokenIssuer.signRefreshToken({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
  }
}

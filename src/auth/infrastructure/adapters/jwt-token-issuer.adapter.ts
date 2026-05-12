import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  TokenIssuer,
  TokenPayload,
} from '../../application/ports/token-issuer.port';

const ACCESS_TOKEN_TTL = '12h';
const REFRESH_TOKEN_TTL = '7d';

@Injectable()
export class JwtTokenIssuer implements TokenIssuer {
  constructor(private readonly jwtService: JwtService) {}

  signAccessToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, { expiresIn: ACCESS_TOKEN_TTL });
  }

  signRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, { expiresIn: REFRESH_TOKEN_TTL });
  }

  verify(token: string): TokenPayload {
    return this.jwtService.verify<TokenPayload>(token);
  }
}

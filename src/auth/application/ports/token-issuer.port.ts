import { UserRole } from '../../../user/domain/value-objects/user-role.vo';

export const TOKEN_ISSUER = Symbol('TOKEN_ISSUER');

export interface TokenPayload {
  sub: number;
  email: string;
  role: UserRole;
}

export interface TokenIssuer {
  signAccessToken(payload: TokenPayload): string;
  signRefreshToken(payload: TokenPayload): string;
  verify(token: string): TokenPayload;
}

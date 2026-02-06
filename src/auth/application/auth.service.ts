import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User, UserRole } from '@prisma/client';
import { JwtPayload } from '../strategy/jwt.strategy';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(user: Pick<User, 'id' | 'email' | 'userRole'>): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.userRole,
    };

    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }

  generateRefreshToken(user: {
    id: number;
    email: string;
    userRole: UserRole;
  }): string {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.userRole,
    };

    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }
}

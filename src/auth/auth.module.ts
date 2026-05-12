import { Module, forwardRef } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from '../user/user.module';
import { TOKEN_ISSUER } from './application/ports/token-issuer.port';
import { AuthService } from './application/services/auth.service';
import { JwtTokenIssuer } from './infrastructure/adapters/jwt-token-issuer.adapter';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET') || 'your-secret-key',
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN') || '1h',
        },
      }),
    }),
    forwardRef(() => UserModule),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    { provide: TOKEN_ISSUER, useClass: JwtTokenIssuer },
  ],
  exports: [AuthService],
})
export class AuthModule {}

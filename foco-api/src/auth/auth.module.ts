import { Module } from '@nestjs/common';
import { AuthService } from '@app/auth/services/auth.service';
import { AuthController } from '@app/auth/controllers/auth.controller';
import { GoogleStrategyService } from '@app/auth/services/google.strategy.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/auth/providers/jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.PRIVATE_KEY_JSONWEBTOKEN_AUTH,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, GoogleStrategyService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}

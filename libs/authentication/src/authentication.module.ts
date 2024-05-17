import { Module } from '@nestjs/common';
import { JWTService } from './service/jwt.service';

@Module({
  providers: [JWTService],
  exports: [JWTService],
})
export class AuthenticationModule {}

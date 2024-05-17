import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Auth, AuthSchema } from './model/auth.model';
import { JWTService } from '../../libs/authentication/src';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTService],
  imports: [
    MongooseModule.forFeatureAsync([
      { name: Auth.name, useFactory: () => AuthSchema },
    ]),
  ],
})
export class AuthModule {}

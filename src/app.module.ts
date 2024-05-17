import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from '../libs/database/src';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';
import { AuthMiddleware } from '../libs/authentication/src/middleware/authentication.middleware';
import { AuthenticationModule } from '../libs/authentication/src/authentication.module';

@Module({
  imports: [
    AuthModule,
    AuthenticationModule,
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    TaskModule,
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // TokenMiddleware;
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: '/', method: RequestMethod.GET },
        { path: '/auth/sign-up', method: RequestMethod.POST },
        { path: '/auth/login', method: RequestMethod.POST },
      )
      .forRoutes({
        path: '*',
        method: RequestMethod.ALL,
      });
  }
}

import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { GlobalExceptionsFilter } from '../libs/utils/src/exception/global.exception';
import { GlobalResponseInterceptor } from '../libs/utils/src/interceptor/global.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { httpAdapter } = app.get(HttpAdapterHost);

  app.useGlobalFilters(new GlobalExceptionsFilter(httpAdapter));
  app.useGlobalInterceptors(new GlobalResponseInterceptor());

  await app.listen(3000).then(() => {
    Logger.log('server running on port 3000');
  });
}
bootstrap();

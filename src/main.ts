import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { HttpExceptionFilter } from 'lib/shared/exception/http-exception.filter';
import { ResponseInterceptor } from 'lib/shared/intercepter/response.interceptor';
import { validateEnv } from 'configs/env.configuration';

async function bootstrap() {
  validateEnv();

  const app = await NestFactory.create(AppModule);
  // global filter
  app.useGlobalFilters(new HttpExceptionFilter());

  // global guard
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  // global interceptor
  app.useGlobalInterceptors(new ResponseInterceptor());

  // config cors
  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();

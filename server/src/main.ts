import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // CORS
  const allowedOrigins = process.env.NODE_ENV === 'production'
    ? ['https://your-production-domain.com'] // 生产环境允许的域名
    : ['http://localhost:3001']; // 开发环境允许的域名

  app.enableCors({
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

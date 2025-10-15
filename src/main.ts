import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const PORT = process.env.PORT ?? 5000;
  const app = await NestFactory.create(AppModule, {});

  app.use(cookieParser());

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Event Spot project')
    .setDescription('eventspot REST API')
    .setVersion('1.0')
    .addTag('NestJS, CRUD, swagger , tokens, Validation')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
   SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
      operationsSorter: (a, b) => {
        const order = { post: 1, get: 2, put: 3, patch: 4, delete: 5 };
        const methodA = a.get('method');
        const methodB = b.get('method');
        return order[methodA] - order[methodB];
      },
    }
  });

  await app.listen(PORT, () => {
    console.log(`Server started at: http://localhost:${PORT}`);
  });
}
bootstrap();

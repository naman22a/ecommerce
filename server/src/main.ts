import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from './validation';
import * as cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    // VALIDATION
    app.useGlobalPipes(new ValidationPipe({ exceptionFactory }));

    // MIDDLWARE
    app.use(cookieParser());
    app.enableCors({
        origin: process.env.CORS_ORIGIN,
        credentials: true,
    });

    // SWAGGER
    const config = new DocumentBuilder()
        .setTitle('Ecommerce API')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    await app.listen(process.env.PORT);
}
bootstrap();

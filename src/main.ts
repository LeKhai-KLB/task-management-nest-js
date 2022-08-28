import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { TransformInterceptor } from "./transform.interceptor";
import { ConfigService } from "@nestjs/config";

async function bootstrap() {
  const logger = new Logger();
  const configService = new ConfigService();
  const PORT = configService.get("APP_PORT");
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(PORT);
  logger.log(`Application listening on port ${PORT}`);
}

bootstrap();

import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { json, urlencoded } from "body-parser";
import helmet from "helmet";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {});
  const configService = app.get(ConfigService);
  app.use(json({ limit: "50mb" }));
  app.use(urlencoded({ limit: "50mb", extended: true }));
  app.enableCors();
  if (configService.get<string>("NODE_ENV") === "production") {
    app.use(helmet());
  }
  await app.listen(configService.get<number>("SERVER_PORT") || 3001);
}

bootstrap();

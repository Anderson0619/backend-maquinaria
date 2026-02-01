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
  // Middleware para priorizar rutas API sobre archivos estáticos
  app.use((req: any, res: any, next: any) => {
    // Si la ruta empieza con /rest, pasa directamente al controlador
    if (req.path.startsWith('/rest')) {
      return next();
    }
    // Para cualquier otra ruta, continúa normalmente (a ServeStaticModule)
    next();
  });
  app.enableCors();
  if (configService.get<string>("NODE_ENV") === "production") {
    app.use(helmet());
  }
  await app.listen(configService.get<number>("SERVER_PORT") || 3001);
}

bootstrap();
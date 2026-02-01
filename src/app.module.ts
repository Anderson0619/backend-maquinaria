import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { MongooseModule } from "@nestjs/mongoose";
import { HeaderResolver, I18nModule } from "nestjs-i18n";
import * as path from "path";
import { AuthModule } from "./auth/auth.module";
import { SharedModule } from "./shared/shared.module";
import { UserModule } from "./user/user.module";
import { VendorModule } from "./vendor/vendor.module";
import { RoleModule } from './role/role.module';
import { ServeStaticModule } from '@nestjs/serve-static/dist/serve-static.module';
import { join } from 'path';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { UbicacionModule } from './ubicacion/ubicacion.module';
import { MovimientoModule } from './movimiento/movimiento.module';
import { ApiRestModule } from './api-rest/api-rest.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: "./schema.gql",
      playground: process.env.NODE_ENV !== "production",
      introspection: process.env.NODE_ENV !== "production",
      driver: ApolloDriver,
      context: ({ req, connection }) =>
        connection ? { req: connection.context } : { req },
      subscriptions: {
        "graphql-ws": {
          path: "/subscriptions",
          onClose: (_connection, reason) => {
            console.debug("closed", reason);
          },
          onNext: _data => {
            console.debug("next", _data);
          },
          onSubscribe: _data => {
            console.debug("subscribe", _data);
          },
          onConnect: _connectionParams => {
            console.debug("connect", _connectionParams);
          },
          onDisconnect: _connectionParams => {
            console.debug("disconnect", _connectionParams);
          },
        },
      },
      installSubscriptionHandlers: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("NODRIZE_DATABASE_URL"),
        //useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRoot({
      fallbackLanguage: "es",
      //parser: I18nJsonParser,
      loaderOptions: {
        path: path.join(__dirname, "/i18n/"),
        watch: true,
      },
      resolvers: [new HeaderResolver(["x-custom-lang"])],
    }),
    UserModule,
    VendorModule,
    AuthModule,
    SharedModule,
    RoleModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/rest/*', '/api/*', '/graphql'], // EXCLUYE RUTAS API
      serveStaticOptions: {
        index: false, // IMPORTANTE: no servir index.html automáticamente
      }
    }),
    MaquinariaModule,
    UbicacionModule,
    MovimientoModule,
    ApiRestModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}

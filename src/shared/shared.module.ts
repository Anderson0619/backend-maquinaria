import { HttpModule } from "@nestjs/axios";
import { Global, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { PassportModule } from "@nestjs/passport";
import { NodrizeModule } from "@nodrize/nodrize";
import {
  RefreshToken,
  RefreshTokenSchema,
} from "src/auth/schemas/refresh-token.schema";
import { Counter, CounterSchema } from "src/common/counter.schema";
import { Role, RoleSchema } from "src/role/role.schema";
import { User, UserSchema } from "src/user/schemas/user.schema";
import { Vendor, VendorSchema } from "src/vendor/vendor.schema";
import { Maquinaria, MaquinariaSchema } from "src/maquinaria/maquinaria.schema";
import { Ubicacion, UbicacionSchema } from "src/ubicacion/ubicacion.schema";

@Global()
@Module({
  imports: [
    PassportModule.register({ defaultStrategy: "jwt" }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Vendor.name, schema: VendorSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: RefreshToken.name, schema: RefreshTokenSchema },
      { name: Role.name, schema: RoleSchema },
      { name: Maquinaria.name, schema: MaquinariaSchema },
      { name: Ubicacion.name, schema: UbicacionSchema },
    ]),
    HttpModule.register({
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      maxRedirects: 5,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        const expiresIn: string = config.get<string>("JWT_EXPIRATION_TIME");
        const secret: string = config.get<string>("JWT_SECRET_KEY");
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
      inject: [ConfigService],
    }),
    NodrizeModule.forRoot({
      nodrizeAuthToken: "AIzaSyDcQ1AvRTdklc85mYBHiXVZIdITpLd-pgk",
      nodrizeBackendApiUrl:
        "https://nodrize-common-gateway-1wim2w8a.ue.gateway.dev",
    }),
  ],
  exports: [
    NodrizeModule,
    MongooseModule,
    HttpModule,
    PassportModule,
    JwtModule,
  ],
})
export class SharedModule {}

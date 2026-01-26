import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RoleRepository } from "src/role/role.repository";
import { RoleService } from "src/role/role.service";
import { UserRepository } from "src/user/user.repository";
import { VendorRepository } from "src/vendor/vendor.repository";
import { VendorService } from "src/vendor/vendor.service";
import { CommonService } from "../common/common.service";
import { UserService } from "../user/user.service";
import { AuthResolver } from "./auth.resolver";
import { AuthService } from "./auth.service";
import { GqlAuthGuard } from "./guard/gql-auth.guard";
import { JwtStrategy } from "./strategy/jwt.strategy";

@Module({
  providers: [
    AuthService,
    AuthResolver,
    UserService,
    UserRepository,
    JwtStrategy,
    GqlAuthGuard,
    CommonService,
    ConfigService,
    RoleService,
    RoleRepository,
    VendorService,
    VendorRepository,
  ],
  exports: [GqlAuthGuard, AuthService],
})
export class AuthModule {}

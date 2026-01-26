import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { RoleRepository } from "src/role/role.repository";
import { RoleService } from "src/role/role.service";
import { VendorRepository } from "src/vendor/vendor.repository";
import { CommonService } from "../common/common.service";
import { VendorService } from "../vendor/vendor.service";
import { UserRepository } from "./user.repository";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";

@Module({
  providers: [
    UserService,
    UserRepository,
    CommonService,
    UserResolver,
    VendorService,
    ConfigService,
    RoleService,
    RoleRepository,
    VendorService,
    VendorRepository,
  ],
})
export class UserModule {}

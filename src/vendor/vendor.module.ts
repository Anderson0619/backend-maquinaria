import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { CommonService } from "src/common/common.service";
import { RoleRepository } from "src/role/role.repository";
import { RoleService } from "src/role/role.service";
import { UserRepository } from "src/user/user.repository";
import { VendorResolver } from "./vendor.resolver";
import { VendorService } from "./vendor.service";

@Module({
  controllers: [],
  providers: [
    VendorService,
    VendorResolver,
    CommonService,
    ConfigService,
    UserRepository,
    RoleRepository,
    RoleService,
  ],
})
export class VendorModule {}

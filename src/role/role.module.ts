import { Module } from "@nestjs/common";
import { RoleRepository } from "./role.repository";
import { RoleResolver } from "./role.resolver";
import { RoleService } from "./role.service";

@Module({
  providers: [RoleResolver, RoleService, RoleRepository],
})
export class RoleModule {}

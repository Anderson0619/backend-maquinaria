import { UseGuards } from "@nestjs/common";
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import { GqlAuthGuard } from "src/auth/guard/gql-auth.guard";
import { GqlUser } from "src/customization/decorators/decorators";
import { User } from "src/user/schemas/user.schema";
import { CreateRoleInput } from "./inputs/create-role.input";
import { DeleteRoleInput } from "./inputs/delete-role.input";
import { GetRoleInput } from "./inputs/get-role.input";
import { UpdateRoleInput } from "./inputs/update-role.input";
import { Role } from "./role.schema";
import { RoleService } from "./role.service";

@Resolver(() => Role)
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Mutation(() => Role, { description: "Create role" })
  @UseGuards(GqlAuthGuard)
  async createRole(
    @Args("createRoleInput") createRoleInput: CreateRoleInput,
    @GqlUser() user: User,
  ): Promise<Role> {
    return this.roleService.createRole(createRoleInput, user);
  }

  @Mutation(() => Role, { description: "Update role" })
  @UseGuards(GqlAuthGuard)
  async updateRole(
    @Args("updateRoleInput") updateRoleInput: UpdateRoleInput,
    @GqlUser() user: User,
  ): Promise<Role> {
    return this.roleService.updateRole(updateRoleInput, user);
  }

  @Mutation(() => Role, { description: "Delete role" })
  @UseGuards(GqlAuthGuard)
  async deleteRole(
    @Args("deleteRoleInput") { id }: DeleteRoleInput,
    @GqlUser() user: User,
  ): Promise<Role> {
    return this.roleService.deleteRole(id, user);
  }

  @Query(() => [Role], { description: "Get all roles" })
  @UseGuards(GqlAuthGuard)
  async getAllRoles(@GqlUser() user: User): Promise<Role[]> {
    return this.roleService.getRoles(user);
  }

  @Query(() => Role, { description: "Get role by id" })
  @UseGuards(GqlAuthGuard)
  async getRole(
    @Args("getRoleInput") { id }: GetRoleInput,
    @GqlUser() user: User,
  ): Promise<Role> {
    return this.roleService.getRole(id, user);
  }

  @ResolveField()
  async routes(@Parent() role: Role) {
    return this.roleService.getRoutes(role);
  }
}

import { Injectable } from "@nestjs/common";
import { UserInputError } from "apollo-server-express";
import { I18nRequestScopeService } from "nestjs-i18n/dist/services/i18n-request-scope.service";
import { User } from "src/user/schemas/user.schema";
import { RoutePathEnum } from "./enums/route-path.enum";
import { CreateRoleInput } from "./inputs/create-role.input";
import { UpdateRoleInput } from "./inputs/update-role.input";
import { RoleRepository } from "./role.repository";
import { Role } from "./role.schema"; 

@Injectable()
export class RoleService {
  constructor(  
    private readonly roleRepository: RoleRepository,
    private readonly i18n: I18nRequestScopeService,
  ) {}

  async getRoles(user: User): Promise<Role[]> {
    return this.roleRepository.find({
      deleted: false,
      vendor: user.selectedVendor,
    });
  }

  async getRole(id: string, user: User): Promise<Role> {
    return this.roleRepository.findOne({ id, vendor: user.selectedVendor });
  }

  async getRolesByIds(ids: string[]): Promise<Role[]> {
    return this.roleRepository.find({
      id: { $in: ids },
    });
  }

  async createRole(
    createRoleInput: CreateRoleInput,
    user: User,
  ): Promise<Role> {
    // * check if role with same name exists
    const storedRole = await this.roleRepository.findOne({
      name: createRoleInput.name,
      deleted: false,
      vendor: user.selectedVendor,
    });

    if (storedRole)
      throw new UserInputError(
        await this.i18n.translate("errors.ROLE_ALREADY_EXISTS", {
          args: { name: createRoleInput.name },
        }),
      );

    const role = await this.roleRepository.create({
      ...createRoleInput,
      deleted: false,
      vendor: user.selectedVendor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return role.save();
  }

  async createRoleWithVendor(
    createRoleInput: CreateRoleInput,
    vendor: string,
  ): Promise<Role> {
    // * check if role with same name exists
    const storedRole = await this.roleRepository.findOne({
      name: createRoleInput.name,
      deleted: false,
    });

    if (storedRole)
      throw new UserInputError(
        await this.i18n.translate("errors.ROLE_ALREADY_EXISTS", {
          args: { name: createRoleInput.name },
        }),
      );

    const role = await this.roleRepository.create({
      ...createRoleInput,
      deleted: false,
      vendor,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return role.save();
  }

  async updateRole(
    updateRoleInput: UpdateRoleInput,
    user: User,
  ): Promise<Role> {
    const storedRole = await this.roleRepository.findOne({
      id: updateRoleInput.id,
      vendor: user.selectedVendor,
    });

    if (!storedRole)
      throw new UserInputError(
        await this.i18n.translate("errors.ROLE_NOT_FOUND", {
          args: { id: updateRoleInput.id },
        }),
      );

    return this.roleRepository.findOneAndUpdate(
      { id: updateRoleInput.id },
      {
        ...updateRoleInput,
        updatedAt: new Date(),
      },
    );
  }

  async deleteRole(id: string, user: User): Promise<Role> {
    const storedRole = await this.roleRepository.findOne({
      id,
      vendor: user.selectedVendor,
    });

    if (!storedRole)
      throw new UserInputError(
        await this.i18n.translate("errors.ROLE_NOT_FOUND", {
          args: { id },
        }),
      );

    return await this.roleRepository.findOneAndUpdate(
      {
        id,
      },
      {
        deleted: true,
        deletedAt: new Date(),
      },
    );
  }

  async getRoleByName(name: string): Promise<Role> {
    return this.roleRepository.findOne({
      name,
      deleted: false,
    });
  }

  async getRoutes(role: Role): Promise<string[]> {
    if (role.name === "ADMIN" && !role.editable && !role.deletable) {
      const routes = Object.keys(RoutePathEnum).map(key => {
        return RoutePathEnum[key];
      });

      return routes;
    }

    return role.routes;
  }
}

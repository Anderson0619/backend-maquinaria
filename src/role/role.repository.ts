import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EntityRepository } from "../customization/database/entity.repository";
import { Role, RoleDocument } from "./role.schema";

@Injectable()
export class RoleRepository extends EntityRepository<RoleDocument> {
  constructor(@InjectModel(Role.name) roleModel: Model<RoleDocument>) {
    super(roleModel);
  }
}

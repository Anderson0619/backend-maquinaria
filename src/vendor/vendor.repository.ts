import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { EntityRepository } from "../customization/database/entity.repository";
import { Vendor, VendorDocument } from "./vendor.schema";

@Injectable()
export class VendorRepository extends EntityRepository<VendorDocument> {
  constructor(@InjectModel(Vendor.name) vendorModel: Model<VendorDocument>) {
    super(vendorModel);
  }
}

import { Vendor } from "../../vendor.schema";
import { VendorStatusEnum } from "../../../vendor/enum/vendor-status.enum";

export const vendorStub = (): Vendor => {
  return {
    id: "5e9f8f8f9f8f8f8f8f8f8f8f",
    slug: "super-vendor-123",
    name: "Super Vendor",
    status: VendorStatusEnum.ACTIVE,
    deleted: false,
  };
};

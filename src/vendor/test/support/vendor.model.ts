import { Vendor } from "src/vendor/vendor.schema";
import { MockModel } from "../../../customization/database/test/support/mock.model";
import { vendorStub } from "../stubs/vendor.stub";

export class VendorModel extends MockModel<Vendor> {
  protected entityStub = vendorStub();
}

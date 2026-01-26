import { Field, InputType } from "@nestjs/graphql";
import { CreateVendorInput } from "./create-vendor.input";

@InputType()
export class UpdateVendorInput extends CreateVendorInput {
  @Field()
  id: string;
}

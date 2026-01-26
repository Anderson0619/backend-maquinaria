import { Field, InputType } from "@nestjs/graphql";
import { CreateVendorUserInput } from "./create-vendor-user.input";

@InputType()
export class UpdateVendorUserInput extends CreateVendorUserInput {
  @Field()
  id: string;
}

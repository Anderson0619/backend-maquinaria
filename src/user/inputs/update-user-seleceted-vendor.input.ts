import { InputType, Field } from "@nestjs/graphql";
import { IsUUID } from "class-validator";

@InputType()
export class UpdateUserSelectedVendorInput {
  @Field()
  @IsUUID()
  vendor?: string;
}

import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetVendorBannersInput {
  @Field()
  vendor: string;
}

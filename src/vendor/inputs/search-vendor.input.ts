import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SearchVendorInput {
  @Field()
  text: string;
}
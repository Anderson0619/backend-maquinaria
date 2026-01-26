import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteVendorUserInput {
  @Field()
  id: string;
}

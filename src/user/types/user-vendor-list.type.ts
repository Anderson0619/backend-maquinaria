import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("UserVendorListTypeInput")
export class UserVendorListType {
  @Field()
  id: string;

  @Field()
  name: string;
}

import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("UserRoleType")
export class UserRole {
  @Field(() => [String])
  role: string[];

  @Field()
  vendor: string;
}

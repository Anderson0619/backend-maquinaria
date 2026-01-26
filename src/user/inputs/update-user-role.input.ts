import { Field, InputType } from "@nestjs/graphql";
import { Role } from "src/role/role.schema";

@InputType()
export class UpdateUserRoleInput {
  @Field(() => [Role])
  roles: string[];

  @Field()
  user: string;
}

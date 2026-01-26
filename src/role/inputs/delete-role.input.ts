import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class DeleteRoleInput {
  @Field()
  id: string;
}

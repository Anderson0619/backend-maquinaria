import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetRoleInput {
  @Field()
  id: string;
}

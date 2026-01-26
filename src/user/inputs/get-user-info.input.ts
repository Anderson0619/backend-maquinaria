import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GetUserInfoInput {
  @Field()
  email: string;
}

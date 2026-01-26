import { Field, InputType } from "@nestjs/graphql"

@InputType()
export class ValidateEmailConfirmationInput {
  @Field()
  email: string;

  @Field()
  random4digits: number;
}

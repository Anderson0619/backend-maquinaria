import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CreateVendorUserInput {
  @Field()
  name: string;

  @Field()
  lastname: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => [String], { nullable: true })
  roles?: string[];
}

import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class SocialNetworkLogInInput {
  @Field()
  accessToken: string;
}

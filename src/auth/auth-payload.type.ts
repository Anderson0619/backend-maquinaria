import { Field, ObjectType } from "@nestjs/graphql"

@ObjectType()
export class AuthPayloadType {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

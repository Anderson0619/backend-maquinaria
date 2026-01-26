import { Field, InputType, ObjectType } from "@nestjs/graphql";

@ObjectType()
@InputType("RefreshTokenPayloadType")
export class RefreshTokenPayload {
  @Field()
  accessToken: string;
}

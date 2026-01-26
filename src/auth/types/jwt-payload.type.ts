import { Field } from "@nestjs/graphql";
export class JwtPayloadType {
  @Field()
  id: string;
}

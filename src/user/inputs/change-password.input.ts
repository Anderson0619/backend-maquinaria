import { Field, InputType } from "@nestjs/graphql"
import { IsUUID, MinLength } from "class-validator"

@InputType()
export class ChangePasswordInput {
  @Field()
  @IsUUID()
  passwordRecoveryToken: string;

  @Field()
  @IsUUID()
  userId: string;

  @Field()
  @MinLength(6)
  password: string;
}

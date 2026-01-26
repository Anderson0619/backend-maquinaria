import { Field, InputType } from "@nestjs/graphql"
import { IsEmail } from "class-validator"

@InputType()
export class ChangePasswordRequestInput {
  @Field()
  @IsEmail()
  email: string;
}

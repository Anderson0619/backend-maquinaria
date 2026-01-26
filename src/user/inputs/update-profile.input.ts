import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsUUID, MinLength } from "class-validator";

@InputType()
export class UpdateProfileInput {
  @Field({ nullable: true })
  @MinLength(1)
  name?: string;

  @Field({ nullable: true })
  @MinLength(1)
  lastname?: string;

  @Field({ nullable: true })
  @IsEmail()
  email?: string;

  @Field({ nullable: true })
  password?: string;
     
  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  profileImage?: string;

  @Field({ nullable: true })
  @IsUUID()
  selectedVendor?: string;
}

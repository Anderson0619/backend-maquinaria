import { Field, InputType } from "@nestjs/graphql";
import { IsEmail } from "class-validator";
import { Role } from "src/role/role.schema";
import { UserNetworkTypeEnum } from "../enums/user-network-type.enum";

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field({ nullable: true })
  lastname?: string;

  @Field()
  @IsEmail()
  email: string;

  @Field({ nullable: true })
  phone?: string;

  @Field()
  password?: string;

  @Field(() => [Role], { nullable: true })
  roles?: string[];

  @Field({ nullable: true })
  active?: boolean;

  @Field({ nullable: true })
  networkType?: UserNetworkTypeEnum;

  @Field({ nullable: true })
  vendor?: string;

  @Field({ nullable: true })
  root?: boolean;
}

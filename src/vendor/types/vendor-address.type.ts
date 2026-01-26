import { Field, InputType, ObjectType } from "@nestjs/graphql";

@InputType("AddressType")
@ObjectType()
export class Address {
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  lat?: number;

  @Field({ nullable: true })
  lng?: number;
}

import { Field, InputType } from "@nestjs/graphql";
import { VendorStatusEnum } from "../enum/vendor-status.enum";
import { Color } from "../types/color.type";
import { Address } from "../types/vendor-address.type";
import { VendorBanner } from "../types/vendor-banner.type";

@InputType()
export class CreateVendorInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  logo?: string;

  @Field(() => [VendorBanner], { nullable: true })
  banners?: VendorBanner[];

  @Field({ nullable: true })
  description?: string;

  @Field(() => VendorStatusEnum, { nullable: true })
  status?: VendorStatusEnum;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  url?: string;

  @Field(() => [Color], { nullable: true })
  colors?: Color[];

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field({ nullable: true })
  thumbnail?: string;

  @Field(() => [String], { nullable: true })
  domains?: string[];
}

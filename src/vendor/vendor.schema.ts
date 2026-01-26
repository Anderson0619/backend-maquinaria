import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Base } from "../customization/schemas/base.schema";
import { VendorStatusEnum } from "./enum/vendor-status.enum";
import { Color } from "./types/color.type";
import { Address } from "./types/vendor-address.type";
import { VendorBanner } from "./types/vendor-banner.type";

export type VendorDocument = Vendor & Document;

@ObjectType({ implements: [Base] })
@InputType("VendorType")
@Schema()
export class Vendor extends Base {
  @Field()
  @Prop()
  slug: string;

  @Field()
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  email?: string;

  @Field(() => VendorStatusEnum, { nullable: true })
  @Prop()
  status?: VendorStatusEnum;

  @Field({ nullable: true })
  @Prop()
  logo?: string;

  @Field(() => [VendorBanner], { nullable: true })
  @Prop()
  banners?: VendorBanner[];

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field(() => Address, { nullable: true })
  @Prop()
  address?: Address;

  @Field(() => [String], { nullable: true })
  @Prop()
  domains?: string[];

  @Field(() => [Color], { nullable: true })
  @Prop()
  colors?: Color[];

  @Field({ nullable: true })
  @Prop()
  url?: string;

  @Field({ nullable: true })
  @Prop()
  thumbnail?: string;
}

export const VendorSchema = SchemaFactory.createForClass(Vendor);

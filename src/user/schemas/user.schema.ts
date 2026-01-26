import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { RoutePathEnum } from "src/role/enums/route-path.enum";
import { Role } from "src/role/role.schema";
import { Base } from "../../customization/schemas/base.schema";
import { Vendor } from "../../vendor/vendor.schema";
import { UserNetworkTypeEnum } from "../enums/user-network-type.enum";
import { UserRole } from "../types/user-role.type";
import { UserVendorListType } from "../types/user-vendor-list.type";

export type UserDocument = User & Document;

@ObjectType({ implements: [Base] })
@InputType("UserType")
@Schema()
export class User extends Base {
  @Field()
  @Prop()
  name: string;

  @Field({ nullable: true })
  @Prop()
  lastname?: string;

  @Field()
  @Prop()
  email: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  recoveryPasswordToken?: string;

  @Field({ nullable: true })
  @Prop()
  password?: string;

  @Field(() => UserNetworkTypeEnum, { nullable: true })
  @Prop()
  networkType?: UserNetworkTypeEnum;

  @Field(() => [UserRole])
  @Prop()
  roles: UserRole[];

  @Field(() => Vendor, { nullable: true })
  @Prop()
  selectedVendor?: string;

  @Field({ nullable: true })
  @Prop()
  random4digits?: number;

  @Field({ defaultValue: false, nullable: true })
  @Prop()
  active?: boolean;

  @Field({ nullable: true })
  @Prop()
  profileImage?: string;

  @Field({ nullable: true, defaultValue: false })
  @Prop()
  root?: boolean;

  @Field(() => [UserVendorListType], { nullable: true })
  vendorList?: UserVendorListType[];

  @Field(() => [Role], { nullable: true })
  vendorRoles?: Role[];

  @Field(() => [RoutePathEnum], { defaultValue: [] })
  userRoutes?: RoutePathEnum[];
}

export const UserSchema = SchemaFactory.createForClass(User);

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Base } from "src/customization/schemas/base.schema";
import { RoutePathEnum } from "./enums/route-path.enum";

export type RoleDocument = Role & Document;

@ObjectType({ implements: [Base] })
@InputType("RoleType")
@Schema()
export class Role extends Base {
  @Field()
  @Prop()
  name: string;

  @Field()
  @Prop()
  vendor: string;

  @Field(() => [RoutePathEnum])
  @Prop()
  routes: RoutePathEnum[];

  @Field()
  @Prop()
  deletable: boolean;

  @Field()
  @Prop()
  editable: boolean;
}

export const RoleSchema = SchemaFactory.createForClass(Role);

import { Field, InterfaceType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type BaseDocument = Base & Document;

@InterfaceType()
@Schema()
export class Base {
  @Field()
  @Prop()
  id: string;

  @Field({ nullable: true })
  @Prop()
  updatedAt?: Date;

  @Field({ nullable: true })
  @Prop()
  createdAt?: Date;

  @Field({ nullable: true })
  @Prop()
  deleted: boolean;

  @Field({ nullable: true })
  @Prop()
  deletedAt?: Date;
}

export const BaseSchema = SchemaFactory.createForClass(Base);

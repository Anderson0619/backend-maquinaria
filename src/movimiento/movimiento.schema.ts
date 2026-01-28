import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Base } from "../customization/schemas/base.schema";

export type MovimientoDocument = Movimiento & Document;

@ObjectType({ implements: [Base] })
@InputType("MovimientoType")
@Schema()
export class Movimiento extends Base {
  @Field(() => String, { nullable: true })
  @Prop()
  movimientoNumber: string; 

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Prop()
  maquinaria: string[];

  @Field(() => String, { nullable: true })
  @Prop()
  solicitante: string;

  @Field(() => String, { nullable: true })
  @Prop()
  autoriza: string;

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Prop()
  traslado: string[];

  @Field(() => [String], { nullable: true, defaultValue: [] })
  @Prop()
  origen: string[];

  @Field(() => String, { nullable: true })
  @Prop()
  fechaT: string;

  @Field(() => String, { nullable: true })
  @Prop()
  fechaS?: string;

  @Field(() => String, { nullable: true })
  @Prop()
  movimiento: string;
}

export const MovimientoSchema = SchemaFactory.createForClass(Movimiento);
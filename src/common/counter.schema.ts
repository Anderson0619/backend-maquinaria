import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { Document } from "mongoose"

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {
  @Prop()
  _id: string;

  @Prop()
  sequence: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter);

import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Base } from "src/customization/schemas/base.schema";

export type UbicacionDocument = Ubicacion & Document;

@ObjectType({implements: [Base]})
@InputType("UbicacionType")
@Schema()
export class Ubicacion extends Base {
    @Field({nullable: true})
    @Prop()
    ubiNumber: string;

    @Field(() => String, {nullable: true})
    @Prop()
    type?: string;
    
    @Field(() => String, {nullable: true})
    @Prop()
    ubicacion?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    provincia?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    canton?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    encargado?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    description?: string;
    
}

export const UbicacionSchema = SchemaFactory.createForClass(Ubicacion);
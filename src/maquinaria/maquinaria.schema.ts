import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from 'mongoose';
import { Base } from "src/customization/schemas/base.schema";

export type MaquinariaDocument = Maquinaria & Document;

@ObjectType({implements: [Base]})
@InputType("MaquinariaType")
@Schema()
export class Maquinaria extends Base {
    @Field({nullable: true})
    @Prop()
    maquiNumber: string;

    @Field(() => String, {nullable: true})
    @Prop()
    identificador?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    type?: string;
    
    @Field(() => String, {nullable: true})
    @Prop()
    mark?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    model?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    anio?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    description?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    estado?: string;

    @Field(() => String, {nullable: true})
    @Prop() 
    location?: string;

    @Field(() => String, {nullable: true})
    @Prop()
    detalle?: string;
    
}

export const MaquinariaSchema = SchemaFactory.createForClass(Maquinaria);
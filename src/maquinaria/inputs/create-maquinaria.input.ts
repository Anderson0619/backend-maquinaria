import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateMaquinariaInput {
  @Field(() => String, { description: 'Maquinaria' })
  maquiNumber: string;

  @Field(() => String, {nullable: true})
  identificador?: string;
  
  @Field(() => String, {nullable: true})
  type?: string;
  
  @Field(() => String, {nullable: true})
  mark?: string;

  @Field(() => String, {nullable: true})
  model?: string;

  @Field(() => String, {nullable: true})
  anio?: string;

  @Field(() => String, {nullable: true})
  description?: string;

  @Field(() => String, {nullable: true})
  estado?: string;

  @Field(() => String, {nullable: true})
  location?: string;

  @Field(() => String, {nullable: true})
  detalle?: string;
}  
   
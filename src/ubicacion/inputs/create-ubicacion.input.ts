import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUbicacionInput {
  @Field(() => String, { description: 'Ubicacion' })
  ubiNumber: string;

  @Field(() => String, {nullable: true})
  type?: string;
  
  @Field(() => String, {nullable: true})
  ubicacion?: string;

  @Field(() => String, {nullable: true})
  provincia?: string;

  @Field(() => String, {nullable: true})
  canton?: string;

  @Field(() => String, {nullable: true})
  encargado?: string;

  @Field(() => String, {nullable: true})
  description?: string;
}  
   
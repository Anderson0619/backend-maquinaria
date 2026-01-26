import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteMaquinariaInput {
  @Field(() => String, { description: 'Maquinaria ID' })
  id: string;
}
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteUbicacionInput {
  @Field(() => String, { description: 'Ubicacion ID' })
  id: string;
}
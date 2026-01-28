import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class DeleteMovimientoInput {
  @Field(() => String, { description: 'Movimiento ID' })
  id: string;
}
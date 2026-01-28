import { PartialType, InputType, Field } from '@nestjs/graphql';
import { CreateMovimientoInput } from './create-movimiento.input';

@InputType()
export class UpdateMovimientoInput extends PartialType(CreateMovimientoInput) {
    @Field(() => String, { description: 'Movimiento ID' })
    id: string;
}

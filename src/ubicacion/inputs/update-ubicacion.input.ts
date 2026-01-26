import { PartialType, InputType, Field } from '@nestjs/graphql';
import { CreateUbicacionInput } from './create-ubicacion.input';

@InputType()
export class UpdateUbicacionInput extends PartialType(CreateUbicacionInput) {
    @Field(() => String, { description: 'Ubicacion ID' })
    id: string;
}

import { PartialType, InputType, Field } from '@nestjs/graphql';
import { CreateMaquinariaInput } from './create-maquinaria.input';

@InputType()
export class UpdateMaquinariaInput extends PartialType(CreateMaquinariaInput) {
    @Field(() => String, { description: 'Maquinaria ID' })
    id: string;
}

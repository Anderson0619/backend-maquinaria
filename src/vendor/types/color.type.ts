import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { EColorType } from '../enum/color-type.enum'

@InputType()
@ObjectType('ColorType')
export class Color {
    @Field()
    color: string

    @Field()
    type: EColorType
}

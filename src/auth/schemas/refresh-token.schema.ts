import { Field, InputType, ObjectType } from '@nestjs/graphql'
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'
import { Base } from 'src/customization/schemas/base.schema'

export type RefreshTokenDocument = RefreshToken & Document

@ObjectType({ implements: [Base] })
@InputType('RefreshTokenType')
@Schema()
export class RefreshToken extends Base {
    @Field()
    @Prop()
    user: string

    @Field()
    @Prop()
    expires: Date

    @Field(() => Boolean)
    @Prop()
    revoked: boolean
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken)

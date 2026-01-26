import { Field, InputType, Int } from '@nestjs/graphql'

@InputType()
export class GetVendorsInput {
    @Field(() => Int, { defaultValue: 10 })
    limit: number

    @Field(() => Int, { defaultValue: 0 })
    skip: number

    @Field({ nullable: true })
    name?: string
}

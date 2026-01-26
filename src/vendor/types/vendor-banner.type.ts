import { Field, InputType, ObjectType } from '@nestjs/graphql'

@ObjectType()
@InputType('VendorBannerType')
export class VendorBanner {
    @Field({ nullable: true })
    title?: string

    @Field({ nullable: true })
    description?: string

    @Field()
    bannerUrl: string

    @Field({ nullable: true })
    cta?: string

    @Field({ nullable: true })
    btnColor?: string

    @Field({ nullable: true })
    btnText?: string

    @Field({ nullable: true })
    align?: string

    @Field({ nullable: true })
    modal?: string
}

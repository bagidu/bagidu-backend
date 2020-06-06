import { InputType, Field, Int } from '@nestjs/graphql'

@InputType()
export class DonationInput {
    @Field()
    name: string
    @Field(type => Int)
    amount: number
    @Field({ nullable: true })
    message?: string
    @Field({ nullable: true })
    payment_method?: string
}
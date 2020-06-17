import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class QrisField {
    @Field({ nullable: true })
    qr?: string
    @Field({ nullable: true })
    signature?: string
}

@ObjectType()
export class Donation {
    @Field()
    id: string
    @Field()
    name: string
    @Field(type => Int)
    amount: number
    @Field({ nullable: true })
    message?: string
    @Field()
    qr: string
    @Field(type => QrisField, { nullable: true })
    qris?: QrisField
    @Field()
    payment_method: string
    @Field(type => Date)
    createdAt: Date
    @Field()
    status: string
}

@ObjectType()
export class Balance {
    @Field(type => Int)
    amount: number
}

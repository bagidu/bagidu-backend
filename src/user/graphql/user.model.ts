import { ObjectType, Field } from '@nestjs/graphql'
import { Token } from 'graphql'

@ObjectType()
export class User {
    @Field(type => String)
    id: string
    @Field()
    name: string
    @Field()
    email: string
    @Field()
    username: string
    @Field(type => Date)
    createdAt: Date
    @Field()
    password: string
    // @Field(type => [Token])
    // tokens: Token[]
}
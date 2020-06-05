import { Field, ObjectType, Int } from '@nestjs/graphql'
import { User } from 'src/user/graphql/user.model'

@ObjectType()
export class LoginInfo {
    @Field()
    access_token: string
    @Field({ nullable: true })
    refresh_token?: string
    @Field()
    expired: number
}
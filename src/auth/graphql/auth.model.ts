import { Field, ObjectType, Int } from '@nestjs/graphql'
import { User } from '../../user/graphql/user.model'


@ObjectType()
export class LoginInfo {
    @Field()
    id: string
    @Field()
    access_token: string
    @Field({ nullable: true })
    refresh_token?: string
    @Field()
    expired: number
    @Field(returns => User, { nullable: true })
    user?: User
}
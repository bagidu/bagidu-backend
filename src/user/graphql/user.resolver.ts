import { Resolver, Args, Query, ResolveField, Parent } from '@nestjs/graphql'
import { User } from './user.model'
import { UserService } from '../user.service'
import { UseGuards, Req } from '@nestjs/common'
import { JwtGqlGuard } from '../../auth/jwt-auth.guard'
import { GqlUser } from '../../auth/user.decorator'
import { AuthService } from 'src/auth/auth.service'

@Resolver(of => User)
export class UserResolver {
    constructor(
        private userService: UserService,
    ) { }

    @Query(returns => User)
    async user(@Args('id') id: string) {
        return this.userService.findById(id)
    }

    @Query(returns => User)
    @UseGuards(JwtGqlGuard)
    async me(@GqlUser() user: any) {
        return this.userService.findById(user.id)
    }


}
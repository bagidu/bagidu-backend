import { Resolver, Args, Query, ResolveField, Parent } from '@nestjs/graphql'
import { User } from './user.model'
import { UserService } from '../user.service'
import { UseGuards, Req, UseFilters, NotFoundException } from '@nestjs/common'
import { JwtGqlGuard } from '../../auth/jwt-auth.guard'
import { GqlUser } from '../../auth/user.decorator'

@Resolver(of => User)
export class UserResolver {
    constructor(
        private userService: UserService,
    ) { }

    @Query(returns => User)
    async user(@Args('id') id: string) {
        const user = await this.userService.findById(id)
        if (!user) {
            throw new NotFoundException('User Not Found')
        }
        return user
    }

    @Query(returns => User)
    @UseGuards(JwtGqlGuard)
    async me(@GqlUser() user: any) {
        const result = await this.userService.findById(user.id)
        if (!result) {
            throw new NotFoundException('User Not Found')
        }
        return result
    }


}
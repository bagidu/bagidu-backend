import { Resolver, Args, Query, ResolveField, Parent, Mutation } from '@nestjs/graphql'
import { User } from './user.model'
import { UserService } from '../user.service'
import { UseGuards, Req, UseFilters, NotFoundException, BadRequestException } from '@nestjs/common'
import { JwtGqlGuard } from '../../auth/jwt-auth.guard'
import { GqlUser } from '../../auth/user.decorator'
import { RegisterInput } from './register.input'
import { HttpExceptionFilter } from '../../common/gqlexception.filter'

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

    @Mutation(returns => User)
    async register(@Args('data') data: RegisterInput) {
        const emailExists = await this.userService.findBy({ email: data.email })
        if (emailExists) {
            throw new BadRequestException('Email already in use')
        }

        const usernameExists = await this.userService.findBy({ username: data.username })
        if (usernameExists) {
            throw new BadRequestException('Username already in use')
        }

        return this.userService.create(data)
    }


}
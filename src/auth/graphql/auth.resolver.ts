import { AuthService } from '../auth.service'
import { LoginInfo } from './auth.model'
import { Query, Args, Resolver, Context, Mutation, ResolveField, Parent } from '@nestjs/graphql'
import { User as UserEntity } from '../../user/entities/user.entity'
import { UnauthorizedException, UseGuards } from '@nestjs/common'
import { GqlUser } from '../user.decorator'
import { JwtGqlGuard } from '../jwt-auth.guard'
import { UserService } from '../../user/user.service'

@Resolver(of => LoginInfo)
export class AuthResolver {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    @Query(returns => LoginInfo)
    async login(
        @Args('username') username: string,
        @Args('password') password: string,
        @Context() ctx: any
    ) {
        const user = await this.authService.validateUser(username, password)
        const data = await this.authService.login(user)
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + 7)


        ctx.res.cookie('refresh_token', data.refresh_token, {
            expires: expDate,
            httpOnly: true,
            // domain: 'localhost'
        })

        return data
    }

    @ResolveField()
    async user(@Parent() login: LoginInfo) {
        const { id } = login
        return this.userService.findById(id)
    }

    @Query(returns => LoginInfo)
    async token(@Context() ctx: any) {
        const token = ctx.req.cookies.refresh_token
        try {
            const data = await this.authService.accessToken(token)
            return data
        } catch (e) {
            throw new UnauthorizedException('invalid token occured')
        }
    }

    @Mutation(returns => Boolean)
    @UseGuards(JwtGqlGuard)
    async logout(@Context() ctx: any, @GqlUser() user: any) {
        const token = ctx.req.cookies.refresh_token
        // Delete Token
        await this.authService.logout(user.id, token)
        ctx.res.cookie('refresh_token', '', {
            httpOnly: true,
        })

        return true
    }
}
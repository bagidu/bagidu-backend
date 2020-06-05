import { AuthService } from '../auth.service'
import { LoginInfo } from './auth.model'
import { Query, Args, Resolver, Context } from '@nestjs/graphql'
import { User as UserEntity } from '../../user/entities/user.entity'
import { UnauthorizedException } from '@nestjs/common'

@Resolver(of => LoginInfo)
export class AuthResolver {
    constructor(
        private authService: AuthService
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
}
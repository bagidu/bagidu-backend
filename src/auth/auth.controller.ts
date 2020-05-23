import { Controller, Post, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Res, Req } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { Response } from 'express';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Req() req: any, @Res() response: Response) {
        const data = await this.authService.login(req.user)
        const expDate = new Date()
        expDate.setDate(expDate.getDate() + 7)

        response.cookie('refresh_token', data.refresh_token, {
            expires: expDate,
            httpOnly: true,
            // domain: 'localhost'
        })

        response.send(data)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async profile(@Req() req: any) {
        return req.user
    }
}

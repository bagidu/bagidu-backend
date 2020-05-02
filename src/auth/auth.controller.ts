import { Controller, Post, Request, UseGuards, UseInterceptors, ClassSerializerInterceptor, Get, Req } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req: any) {
        return this.authService.login(req.user)
    }

    @UseGuards(JwtAuthGuard)
    @Get('/profile')
    async profile(@Request() req: any) {
        return req.user
    }
}

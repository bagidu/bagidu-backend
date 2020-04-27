import { Controller, Post, Request, UseGuards, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {

    @UseGuards(LocalAuthGuard)
    @Post('login')
    async login(@Request() req) {
        return req.user
    }
}

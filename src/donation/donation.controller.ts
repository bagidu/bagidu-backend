import { Controller, Get, UseGuards, Req, Body, Post, Param, NotFoundException, UseInterceptors, ClassSerializerInterceptor } from '@nestjs/common';
import { DonationService } from './donation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { UserService } from '../user/user.service';
import { MakeDonationResponse } from './dtos/make-donation.response';

@Controller('donation')
@UseInterceptors(ClassSerializerInterceptor)
export class DonationController {
    constructor(
        private readonly donationService: DonationService,
        private readonly userService: UserService
    ) { }

    // @UseGuards(JwtAuthGuard)
    // @Get()
    // async all(@Req() { user }: any) {
    //     return this.donationService.allByUser(user.id)
    // }

    @Post(':username')
    async create(@Body() data: MakeDonationDto, @Param('username') username: string) {
        const user = await this.userService.findBy({ username })

        if (!user) {
            throw new NotFoundException(`User ${username} not found`)
        }

        const donation = await this.donationService.create(data, user.id)
        return MakeDonationResponse.fromModel(donation)
    }
}

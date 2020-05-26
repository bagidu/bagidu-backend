import {
    Controller,
    Get,
    UseGuards,
    Req,
    Body,
    Post,
    Param,
    NotFoundException,
    UseInterceptors,
    ClassSerializerInterceptor,
    BadRequestException
} from '@nestjs/common';
import { DonationService } from './donation.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { UserService } from '../user/user.service';
import { MakeDonationResponse } from './dtos/make-donation.response';
import { XenditCallbackDto } from './dtos/xendit-callback.dto';
import { DonationResponse } from './dtos/donation.response';

@Controller('donation')
@UseInterceptors(ClassSerializerInterceptor)
export class DonationController {
    constructor(
        private readonly donationService: DonationService,
        private readonly userService: UserService
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get('/')
    async all(@Req() { user }: any) {
        const data = await this.donationService.allByUser(user.id)
        return DonationResponse.fromList(data)
    }

    @Post(':username')
    async create(@Body() data: MakeDonationDto, @Param('username') username: string) {
        const user = await this.userService.findBy({ username })

        if (!user) {
            throw new NotFoundException(`User ${username} not found`)
        }

        const donation = await this.donationService.create(data, user.id)
        return MakeDonationResponse.fromModel(donation)
    }

    @Get(':id')
    async detail(@Param('id') id: string) {
        const donation = await this.donationService.detail(id)
        if (!donation) {
            throw new NotFoundException('Donation not found')
        }

        return MakeDonationResponse.fromModel(donation)
    }


    @Post(':id/callback')
    async callback(@Param('id') id: string, @Body() data: XenditCallbackDto) {
        // Check If Exists
        const donation = await this.donationService.detail(id)
        if (!donation) {
            throw new NotFoundException('Donation not found')
        }

        // Check on Xendit
        const valid = await this.donationService.validate(id)
        if (data.status === 'COMPLETED' && valid) {
            donation.status = 'SUCCESS'
            await donation.save()
            return "OK"
        }

        throw new BadRequestException('Invalid payment')
    }
}

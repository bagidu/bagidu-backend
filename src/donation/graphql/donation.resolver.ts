import { Resolver, Query } from '@nestjs/graphql'
import { Donation } from './donation.model'
import { DonationService } from '../donation.service'
import { UserService } from '../../user/user.service'
import { EventsGateway } from '../..//events/events.gateway'
import { GqlUser } from '../../auth/user.decorator'
import { UseGuards } from '@nestjs/common'
import { JwtGqlGuard } from '../../auth/jwt-auth.guard'

@Resolver(of => Donation)
export class DonationResolver {
    constructor(
        private readonly donationService: DonationService,
        private readonly userService: UserService,
        private readonly event: EventsGateway
    ) { }

    @Query(returns => [Donation])
    @UseGuards(JwtGqlGuard)
    async donations(@GqlUser() user: any) {
        const data = await this.donationService.allByUser(user.id)
        return data
        // return DonationResponse.fromList(data)
    }
}
import { Resolver, Query, Args, Mutation, InputType } from '@nestjs/graphql'
import { Donation, Balance } from './donation.model'
import { DonationService } from '../donation.service'
import { UserService } from '../../user/user.service'
import { EventsGateway } from '../..//events/events.gateway'
import { GqlUser } from '../../auth/user.decorator'
import { UseGuards, NotFoundException } from '@nestjs/common'
import { JwtGqlGuard } from '../../auth/jwt-auth.guard'
import { DonationInput } from '../dtos/donation.input'

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

    @Query(returns => Donation)
    async donation(@Args('id') id: string) {
        const donation = await this.donationService.detail(id)
        if (!donation) {
            throw new NotFoundException('Donation not found')
        }
        return donation
    }

    @Query(returns => Balance)
    @UseGuards(JwtGqlGuard)
    async balance(@GqlUser() user: any) {
        return this.donationService.balance(user.id)
    }

    @Mutation(returns => Donation)
    async makeDonation(
        @Args('username') username: string,
        @Args('donation') donation: DonationInput
    ) {

        const user = await this.userService.findBy({ username })

        if (!user) {
            throw new NotFoundException(`User ${username} not found`)
        }

        return await this.donationService.create(donation, user.id)
    }
}
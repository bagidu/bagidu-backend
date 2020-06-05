import { Module } from '@nestjs/common'
import { DonationController } from './donation.controller'
import { DonationService } from './donation.service'
import { MongooseModule } from '@nestjs/mongoose'
import { DonationSchema } from './schemas/donation.schema'
import { UserModule } from '../user/user.module'
import { XenditModule } from '../xendit/xendit.module'
import { EventsModule } from '../events/events.module'
import { DonationResolver } from './graphql/donation.resolver'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Donation', schema: DonationSchema }
    ]),
    UserModule,
    XenditModule,
    EventsModule
  ],
  controllers: [DonationController],
  providers: [DonationService, DonationResolver]
})
export class DonationModule { }

import { Module } from '@nestjs/common';
import { DonationController } from './donation.controller';
import { DonationService } from './donation.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DonationSchema } from './schemas/donation.schema';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Donation', schema: DonationSchema }
    ]),
    UserModule
  ],
  controllers: [DonationController],
  providers: [DonationService]
})
export class DonationModule { }

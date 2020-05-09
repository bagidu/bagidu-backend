import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './interfaces/donation.interface';
import { Model } from 'mongoose';
import { Donation as DonationEntity } from './entities/donation.entity'
import { plainToClass } from 'class-transformer';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { XenditService } from '../xendit/xendit.service';

@Injectable()
export class DonationService {
    constructor(
        @InjectModel('Donation') private donationModel: Model<Donation>,
        private xenidtService: XenditService
    ) { }

    async allByUser(userId: string): Promise<DonationEntity[]> {
        const donations = await this.donationModel.find({ to: userId }).populate('to').lean()
        return plainToClass(DonationEntity, donations)
    }

    async create(data: MakeDonationDto): Promise<DonationEntity> {
        const donation = await this.donationModel.create(data)
        const xendit = await this.xenidtService.createQr(donation.id,donation.amount)

        donation.qr = xendit.qr_string
        await donation.save()

        const result = await this.donationModel.findOne({ _id:donation.id}).lean().populate('to')

        return plainToClass(DonationEntity,  result)
    }
}

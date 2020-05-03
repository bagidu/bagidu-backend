import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './interfaces/donation.interface';
import { Model } from 'mongoose';
import { Donation as DonationEntity } from './entities/donation.entity'
import { plainToClass } from 'class-transformer';
import { MakeDonationDto } from './dtos/make-donation.dto';

@Injectable()
export class DonationService {
    constructor(@InjectModel('Donation') private donationModel: Model<Donation>) { }

    async allByUser(userId: string): Promise<DonationEntity[]> {
        const donations = await this.donationModel.find({ to: userId }).lean().populate('to')
        return plainToClass(DonationEntity, donations)
    }

    async create(data: MakeDonationDto): Promise<DonationEntity> {
        let donation = await this.donationModel.create(data)
        donation = await this.donationModel.findOne({ _id: donation._id }).lean().populate('to')
        return plainToClass(DonationEntity, donation)
    }
}

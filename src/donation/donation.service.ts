import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './interfaces/donation.interface';
import { Model } from 'mongoose';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { XenditService } from '../xendit/xendit.service';

@Injectable()
export class DonationService {
    constructor(
        @InjectModel('Donation') private donationModel: Model<Donation>,
        private xenidtService: XenditService
    ) { }

    async allByUser(userId: string): Promise<Donation[]> {
        return await this.donationModel.find({ to: userId })
    }

    async create(data: MakeDonationDto, to: string): Promise<Donation> {
        const donation = await this.donationModel.create({ ...data, to })
        const xendit = await this.xenidtService.createQr(donation.id, donation.amount)

        donation.qr = xendit.qr_string
        await donation.save()

        return donation
    }

    async detail(id: string): Promise<Donation> {
        return this.donationModel.findById(id)
    }
}

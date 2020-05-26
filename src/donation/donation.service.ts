import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Donation } from './interfaces/donation.interface';
import { Model, isValidObjectId } from 'mongoose';
import { MakeDonationDto } from './dtos/make-donation.dto';
import { XenditService } from '../xendit/xendit.service';
import { DonationResponse } from './dtos/donation.response';
import { Balance } from './interfaces/balance.interface';
import { Types } from 'mongoose'

@Injectable()
export class DonationService {
    constructor(
        @InjectModel('Donation') private donationModel: Model<Donation>,
        private xenidtService: XenditService
    ) { }

    async allByUser(userId: string): Promise<Donation[]> {
        return await this.donationModel.find({ to: userId, status: 'SUCCESS' }).sort({ createdAt: -1 })
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

    async balance(id: string): Promise<Balance> {
        const result = await this.donationModel.aggregate<Balance>([
            {
                $match: {
                    status: 'SUCCESS',
                    to: Types.ObjectId(id)
                },
            },
            {

                $group: {
                    _id: '$to',
                    amount: {
                        $sum: '$amount'
                    }
                }
            }
        ])

        if (result && result.length > 0) {
            return result[0]
        } else {
            return {
                _id: id,
                amount: 0
            }
        }
    }

    async validate(id: string): Promise<boolean> {
        const trx = await this.xenidtService.transactionStatus(id)
        if (trx.external_id !== id) {
            return false
        }

        if (trx.status === 'ACTIVE') {
            return false
        }

        return true
    }
}

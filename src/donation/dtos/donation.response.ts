import { Donation } from "../interfaces/donation.interface"
import { plainToClass, Expose, Type } from "class-transformer"

export class DonationResponse {
    @Expose({ name: 'id' })
    _id: string
    @Expose()
    name: string
    @Expose()
    status: string
    @Expose()
    amount: number
    @Expose()
    message: string
    @Expose()
    @Type(() => Date)
    createdAt: Date

    // static fromModel(donation: Donation) {
    //     return plainToClass(DonationResponse, donation, { strategy: 'excludeAll' })
    // }

    static fromList(donations: Donation[]) {
        return plainToClass(DonationResponse, donations, { strategy: 'excludeAll' })
    }
}

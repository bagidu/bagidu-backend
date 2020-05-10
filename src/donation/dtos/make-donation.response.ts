import { Donation } from "../interfaces/donation.interface"
import { plainToClass, Expose, Exclude } from "class-transformer"

export class MakeDonationResponse {
    @Expose({ name: 'id' })
    _id: string

    @Expose()
    name: string
    @Expose()
    amount: number
    @Expose()
    message: string
    @Expose()
    qr: string
    @Expose()
    status: string

    // @Expose()
    // get id() {
    //     return this._id.toString()
    // }

    static fromModel(donation: Donation) {
        return plainToClass(MakeDonationResponse, donation, { strategy: 'excludeAll' })
    }
}
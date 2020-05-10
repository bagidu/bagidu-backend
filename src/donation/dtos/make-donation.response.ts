import { Donation } from "../interfaces/donation.interface"
import { plainToClass } from "class-transformer"

export class MakeDonationResponse {
    name:string
    amount:number
    message: string
    qr:string

    static fromModel(donation:Donation) {
        return plainToClass(MakeDonationResponse,donation)
    }
}
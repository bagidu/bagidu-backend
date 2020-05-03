import { IsNotEmpty } from "class-validator"

export class MakeDonationDto {
    name: string
    to: string
    @IsNotEmpty()
    amount: number
    message: string
}
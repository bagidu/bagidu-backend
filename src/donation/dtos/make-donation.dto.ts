import { IsNotEmpty, Min } from "class-validator"

export class MakeDonationDto {
    @IsNotEmpty()
    name: string
    // to: string
    @Min(1500)
    amount: number
    message: string
}
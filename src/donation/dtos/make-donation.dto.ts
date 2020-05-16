import { IsNotEmpty, Min } from "class-validator"
import { Transform } from "class-transformer"

export class MakeDonationDto {
    @IsNotEmpty()
    name: string
    // to: string
    @Min(1500)
    @Transform(a => parseInt(a))
    amount: number
    message: string
}
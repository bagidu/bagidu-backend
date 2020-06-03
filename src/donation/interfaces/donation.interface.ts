import { Document } from 'mongoose'

export interface Donation extends Document {
    id: string,
    name: string,
    amount: number,
    message: string,
    createdAt: Date,
    to: string,
    status: string,
    qr?: string
    qris?: {
        qr: string,
        signature: string
    },
    payment_method?: string
}

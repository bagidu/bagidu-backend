import { Document } from 'mongoose'

export interface Donation extends Document {
    id: string,
    amount: number,
    message: string,
    createdAt: Date,
    to: string,
    status: string,
    qr:string
}

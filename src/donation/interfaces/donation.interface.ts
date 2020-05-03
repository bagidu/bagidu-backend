import { Document } from "mongoose";
import { User } from "src/user/interfaces/user.interface";

export interface Donation extends Document {
    id: string,
    amount: number,
    message: string,
    createdAt: Date,
    to: string
}
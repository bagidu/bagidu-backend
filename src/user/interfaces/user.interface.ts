import { Document } from 'mongoose'
import { Token } from './token.interface'
export interface User extends Document {
    id: string,
    name: string,
    email: string,
    username: string,
    createdAt: Date,
    password: string,
    tokens: [Token]
}

import { Document } from "mongoose";

export interface UserBase {
    name: string,
    email: string,
    username: string,
    createdAt: Date,
    password: string
}

export interface User extends Document, UserBase {
}

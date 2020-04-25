import { UserBase } from "../interfaces/user.interface";

export class User implements UserBase {
    name: string;
    email: string;
    username: string;
    createdAt: Date;
    password: string
}
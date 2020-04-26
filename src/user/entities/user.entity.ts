import { Exclude, Expose, Transform } from 'class-transformer'
import { ObjectId } from 'mongodb'
import { User as UserInterface } from '../interfaces/user.interface'
export class User {
    // @Expose({ name: '_id' })
    // @Transform((objectId) => objectId.str, { toClassOnly: false })
    // id: string;
    constructor(user: UserInterface) {
        this._id = user._id
        this.name = user.name
        this.email = user.email
        this.username = user.username
        this.createdAt = user.createdAt
        this.password = user.password
    }

    @Transform(id => id.toString())
    @Expose()
    _id: ObjectId;

    @Expose()
    name: string;
    @Expose()
    email: string;
    @Expose()
    username: string;
    @Expose()
    createdAt: Date;

    @Exclude()
    password: string

    @Expose()
    userEmail(): string {
        return this.name + this.email
    }
}
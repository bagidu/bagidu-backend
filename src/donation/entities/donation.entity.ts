import { Expose, Exclude, Type } from 'class-transformer'
import { User } from '../../user/entities/user.entity'

export class Donation {
    @Exclude({ toPlainOnly: true })
    _id: string;

    amount: number;
    message: string;

    @Expose({ name: 'created_at', toPlainOnly: true })
    createdAt: Date;

    @Type(() => User)
    to: User

    @Expose({ toPlainOnly: true })
    get id() {
        return this._id.toString()
    }
}
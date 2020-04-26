import { Exclude, Expose, Transform } from 'class-transformer'
export class User {

    @Expose({ name: '_id' })
    @Transform(id => id.toString())
    id: string;

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
    get userEmail(): string {
        return this.name + " " + this.email
    }
}
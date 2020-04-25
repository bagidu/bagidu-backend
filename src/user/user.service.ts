import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async create(data: CreateUserDto): Promise<User> {
        const user = new this.userModel(data)
        return user.save()
    }

    async all(): Promise<User[]> {
        return this.userModel.find()
    }
}

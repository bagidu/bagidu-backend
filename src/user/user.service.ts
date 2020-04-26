import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { ObjectID } from 'mongodb'

@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async create(data: CreateUserDto): Promise<User> {
        const user = new this.userModel(data)
        return user.save()
    }

    async all(): Promise<User[]> {
        const result = await this.userModel.find().select('-password')
        return result
    }

    async findById(id: string): Promise<User> {
        const user = await this.userModel.findOne({
            $or: [
                { _id: isValidObjectId(id) ? new ObjectID(id) : new ObjectID() },
                { username: id }
            ]
        }).select('-password')
        return user
    }

    async findBy(query: any): Promise<User> {
        return this.userModel.findOne(query)
    }
}

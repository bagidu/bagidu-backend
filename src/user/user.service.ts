import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';
import { User } from './interfaces/user.interface';
import { CreateUserDto } from './dtos/create-user.dto';
import { ObjectID } from 'mongodb'
import { User as UserEntity } from './entities/user.entity'
import { plainToClass } from 'class-transformer';
@Injectable()
export class UserService {
    constructor(@InjectModel('User') private userModel: Model<User>) { }

    async create(data: CreateUserDto): Promise<UserEntity> {
        const user = new this.userModel(data)
        const result = await (await user.save()).toObject()
        return plainToClass(UserEntity, result)
    }

    async all(): Promise<UserEntity[]> {
        const result = await this.userModel.find().lean()
        return plainToClass(UserEntity, result)
    }

    async findById(id: string): Promise<UserEntity> {
        const user = await this.userModel.findOne({
            $or: [
                { _id: isValidObjectId(id) ? new ObjectID(id) : new ObjectID() },
                { username: id }
            ]
        }).lean()
        return plainToClass(UserEntity, user)
    }

    async findBy(query: any): Promise<UserEntity> {
        const user = await this.userModel.findOne(query).lean()
        return plainToClass(UserEntity, user)
    }
}

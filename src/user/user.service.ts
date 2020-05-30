import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, isValidObjectId, mongo } from 'mongoose'
import { User } from './interfaces/user.interface'
import { CreateUserDto } from './dtos/create-user.dto'
import { User as UserEntity } from './entities/user.entity'
import { plainToClass } from 'class-transformer'
import { Token } from './interfaces/token.interface'

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

    async findById(id: string): Promise<UserEntity | null> {

        const user = await this.userModel.findOne({
            $or: [
                { _id: isValidObjectId(id) ? id : new mongo.ObjectId() },
                { username: id }
            ]
        }).lean()
        return plainToClass(UserEntity, user)
    }

    async findBy(query: any): Promise<UserEntity> {
        const user = await this.userModel.findOne(query).lean()
        return plainToClass(UserEntity, user)
    }

    async saveToken(uid: string, token: string, type: string) {
        const user = await this.userModel.findById(uid)
        user.tokens.push({
            token, type
        } as Token)

        return user.save()
    }

    async removeToken(uid: string, token: string, type: string) {
        const user = await this.userModel.findById(uid)
        const deletedToken = user.tokens.find(f => f.token === token)

        if (deletedToken) {
            deletedToken.remove()
        }

        return user.save()
    }
}

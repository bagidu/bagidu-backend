import * as mongoose from 'mongoose'
import * as bcrypt from 'bcrypt'
import { User } from '../interfaces/user.interface'

export const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    username: {
        type: String,
        index: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })

UserSchema.pre('save', async function (next) {
    const user = this as User
    if (!this.isModified(user.password) && !this.isNew) {
        return next()
    }

    try {
        const encrypted = await bcrypt.hash(user.password, 10)
        user.password = encrypted
        return next()
    } catch (e) {
        return next()
    }
})
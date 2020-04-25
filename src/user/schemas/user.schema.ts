import * as mongoose from 'mongoose'

export const UserSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        index: true,
        unique: true
    },
    username: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
})
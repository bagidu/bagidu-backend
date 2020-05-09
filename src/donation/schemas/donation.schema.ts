import * as mongoose from 'mongoose'

export const DonationSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        amount: {
            type: Number,
            required: true
        },
        message: {
            type: String
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum:['SUCCESS','PENDING','FAILED'],
            default:'PENDING'
        },
        qr: {
            type: String,
            required: false
        }
    },
    {
        versionKey: false
    }
)
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
        }
    },
    {
        versionKey: false
    }
)
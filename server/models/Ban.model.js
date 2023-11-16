import { Schema, model } from "mongoose";

import { BAN_DURATION } from "../config";

const BanSchema = new Schema({
    ip: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    warns:{
        type: Number,
        default: 1
    },
    bans: {
        type: Number,
        default: 1
    },
    date: {
        type: Date
    }
}, {
    toJSON: { getters: true, virtuals: true },
    toObject: { getters: true, virtuals: true }
})

BanSchema.virtual("isBanned").get(function() {
    const now = new Date();
    const target = new Date(this.date);
   
    target.setDate(target.getDate() + this.bans * BAN_DURATION)

    return now < target;
})

export default model('Ban', BancSchema);


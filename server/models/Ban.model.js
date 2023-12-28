const { Schema, model } = require("mongoose");
const { BAN_DURATION } = require("../config");

const BanSchema = new Schema({
    ip: {
        type: String,
        required: true,
        index: true,
        unique: true
    },
    warns:{
        type: Number,
        default: 0
    },
    bans: {
        type: Number,
        default: 0
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

module.exports = model('Ban', BanSchema);


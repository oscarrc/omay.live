import { Schema, model } from "mongoose";

const PeerModel = new Schema({
    peer: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    mode: {
        type: String,
        enum : ["text","video","unmoderated"],
        index: true
    },
    interests: {
        type: [String],
        default: []
    },
    available: {
        type: Boolean,
        default: true,
        index: true
    }
})

export default model('Peer', PeerModel);
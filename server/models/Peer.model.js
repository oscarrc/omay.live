import { Schema, model } from "mongoose";

const PeerModel = new Schema({
    peer: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    ip: {
        type: String,
        required: true
    },
    simulated: {
        type: Boolean,
        default: false
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
        default: false,
        index: true
    },
    lang: {
        type: String,
        default: "any"
    }
})

export default model('Peer', PeerModel);
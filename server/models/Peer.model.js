const { Schema, model } = require("mongoose");

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
    }
})

module.exports = model('Peer', PeerModel);
const { PeerModel } = require("../models");

class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.Peer.estimatedDocumentCount() )
    }

    async findPeer(options){

    }

    async getPeer(peer){
        let found = await this.peer.findOne({ peer })
        return found;
    }

    async peerConnected(peer){
        await this.peer.create({ peer });
    }

    async peerDisconnected(peer){
        await this.peer.deleteOne({ peer })
    }

    async peerUnavailable(peer){
        await this.peer.upddateOne({ peer }, { available: false });
    }

    async peerAvailable(peer){
        await this.peer.upddateOne({ peer }, { available: true });
    }
}

module.exports = new ChatService(PeerModel)

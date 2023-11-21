const { PeerModel } = require("../models");

class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.Peer.estimatedDocumentCount() )
    }

    async findPeer(options){
        const { peer, query } = options;
        const q = {
            peer: { $ne: peer },
            available: true,
            ...query
        }

        console.log(q)
        
        let found = await this.peer.findOne(q);
        
        return found?.peer; 
    }

    async getPeer(peer){
        let found = await this.peer.findOne({ peer })
        return found;
    }

    async peerConnected(peer){
        await this.peer.create(peer);
    }

    async peerDisconnected(peer){
        await this.peer.deleteOne({ peer })
    }

    async peerUnavailable(peer){
        await this.peer.updateOne({ peer }, { available: false });
    }

    async peerAvailable(peer){
        await this.peer.updateOne({ peer }, { available: true });
    }
}

module.exports = new ChatService(PeerModel)

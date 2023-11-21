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
        
        let found = await this.peer.findOne(q)
        return found.peer;
    }

    async getPeer(peer){
        let found = await this.peer.findOne({ peer })
        return found;
    }

    async peerConnected(peer){
        await this.peer.create(peer);
    }

    async peerDisconnected(peer){
        try{
            await this.peer.deleteOne({ peer })
        }catch(e){
            console.log(e)
        }
    }

    async peerUnavailable(peer){
        await this.peer.ateOne({ peer }, { available: false });
    }

    async peerAvailable(peer){
        await this.peer.updateOne({ peer }, { available: true });
    }
}

module.exports = new ChatService(PeerModel)

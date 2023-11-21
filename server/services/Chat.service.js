const { PeerModel } = require("../models");

class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.Peer.estimatedDocumentCount() )
    }

    async findPeer(options){
        let { peer, query } = options;
        
        let found = await this.peer.findOne({ peer: {$ne: peer }, available:true })
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

    async chatStarted(peers){
        await this.peer.upddate({ peer: { $in: peers  } }, { available: false });
    }

    async chatEnded(peers){
        await this.peer.upddateOne({ peer: { $in: peers  } }, { available: true });
    }
}

module.exports = new ChatService(PeerModel)

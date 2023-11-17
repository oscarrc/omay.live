class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.Peer.estimatedDocumentCount() )
    }

    async findPeer(options){

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


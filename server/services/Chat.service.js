const { PeerModel } = require("../models");

class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.Peer.estimatedDocumentCount() )
    }

    async findPeer(options){
        const { peer, mode, query } = options;
        
        const q = {
            peer: { $ne: peer },
            available: true,
            mode: mode,
            ...(query.lang && query?.lang !== "any" ? { lang: query.lang } : {}),            
            ...(query.interests && query.interests.length ? { interests: { "$in": query.interests } } : {})
        }
        console.log(q)
        let found = await this.peer.findOne(q);
        
        let f = found ? 
                    {
                        peer: found.peer,
                        lang: found.lang,
                        common: query.interests ? found.interests.filter( i => query.interests.includes(i) ) : []
                    } : {}
        
        return found?.peer; 
    }
    
    async getPeer(peer){
        let found = await this.peer.findOne({ peer })
        return found;
    }

    async updatePeer(peer, data){
        let updated = await this.peer.findOneAndUpdate({id: peer}, data)
        return updated;
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

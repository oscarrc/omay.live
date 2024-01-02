import { PeerModel } from "../models/index.js";

class ChatService{
    constructor(Peer){
        this.peer = Peer;
    }
    
    get peerCount(){
        return ( async () => this.peer.estimatedDocumentCount() )
    }

    async findPeer(options){
        const { peer, mode, query } = options;
        
        const interests = query.common && query.interests?.length ? 
                            { interests: { "$in": query.interests } } : 
                            {
                                $or: [
                                    { common: true, interests: { $in: query.interests } },
                                    { common: false }
                                ]
                            }

        const lang = query.lang && query?.lang !== "any" ? { lang: query.lang } : {}

        const q = {
            peer: { $ne: peer },
            available: true,
            mode: mode,
            ...interests,
            ...lang
        }

        console.log(q)
        
        let found = await this.peer.findOne(q);
        
        let f = found ? 
                    {
                        id: found.peer,
                        lang: found.lang,
                        interests: found.interests,
                        simulated: found.simulated
                    } : 
                    {
                        id: null,
                        lang: null,
                        interests: [],
                        simulated: false
                    }
        
        return f; 
    }
    
    async getPeer(peer){
        let found = await this.peer.findOne({ peer })
        return found;
    }

    async updatePeer(peer, data){
        let updated = await this.peer.findOneAndUpdate({ peer }, data, {new: true})
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

export default new ChatService(PeerModel)

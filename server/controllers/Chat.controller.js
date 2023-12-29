import { ChatService } from "../services/index.js";

class ChatController {
    constructor (service){
        this.service = service;
    }

    async find(req, res){
        const peer = await ChatService.findPeer(req.body);        
        return res.status(200).send({ peer });
    }

    async count(req, res){
        const count = await ChatService.peerCount();        
        return res.status(200).send({ count });
    }
}

export default new ChatController(ChatService)
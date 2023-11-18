const { ChatService } = require("../services");

class ChatController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
    } 

    async find(req, res){
        const peer = await ChatService.findPeer(req.query);
        return res.status(200).send({ peer });
    }
}

module.exports = new ChatController(ChatService)
const { ChatService } = require("../services");

class ChatController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
    } 

    async find(req, res){
    }
}

module.exports = new ChatController(ChatService)
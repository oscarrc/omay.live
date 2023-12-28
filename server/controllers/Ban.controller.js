import { BanService } from "../services/index.js";

class BanController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
        const { ip } = req.query;
        const isBanned = await this.service.isBanned(ip);

        return res.status(200).send({ isBanned });
    }

    async ban(req, res){        
        const { ip } = req.body;
        const isBanned = await this.service.warn(ip);

        return res.status(200).send({ isBanned });
    }
}

export default new BanController(BanService)
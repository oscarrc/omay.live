import { AdService } from "../services/index.js";

class AdController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
        const { zones, ip } = req.body;
        const isBanned = await this.service.getAds(zones, ip);

        return res.status(200).send({ isBanned });
    }
}

export default new AdController(AdService)
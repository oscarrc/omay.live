import { AdService } from "../services/index.js";

class AdController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
        const { zoneId } = req.query;
        const ip = req.ip;
        const ad = await this.service.getAds([zoneId], ip);
        return res.status(200).send(ad);
    }
}

export default new AdController(AdService)
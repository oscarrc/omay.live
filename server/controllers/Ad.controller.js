import { AdService } from "../services/index.js";
import { readFileSync } from "fs";

class AdController {
    constructor (service){
        this.service = service;
    }

    async get(req, res){
        const { zoneId } = req.query;
        const ip = req.ip || req.headers["true-client-ip"] || req.headers["x-forwarded-for"]?.split(",")[0];
        const ad = await this.service.getAds([zoneId], ip);

        await Promise.all(
            ad.zones.map( async (z) => {
                if(!z.data?.image) return z;
                
                let res = await fetch(z.data.image, { mode : 'no-cors' });
                let blob = await res.blob();
                let arrayBuffer = await blob.arrayBuffer();
                
                z.data.image = `data:image/${z.data.image.split(".").pop()};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                return z;
            })
        )
        
        return res.status(200).send(ad);
    }
}

export default new AdController(AdService)
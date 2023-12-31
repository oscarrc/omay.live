import { BanModel } from "../models/index.js";

class BanService{
    constructor(Ban){
        this.ban = Ban;
    }

    async isBanned(ip){
        const found = await this.ban.findOne({ ip })

        if(!found) return false;
        if(!found.isBanned && found.warns >= 3){
            found.warns = 0;
            await found.save();
        } 

        return found.isBanned;
    }

    async warn(ip){
        const warned = await this.ban.findOneAndUpdate({ ip }, {$inc : {warns : 1} }, { upsert:true, new:true });
       
        if(warned.warns >= 3){
            warned.date = new Date();
            warned.bans = warned.bans + 1
            await warned.save();
            return true
        }

        return false
    }
}

export default new BanService(BanModel)

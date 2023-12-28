const { BanModel } = require("../models");

class BanService{
    constructor(Ban){
        this.ban = Ban;
    }

    async isBanned(ip){
        const found = await this.ban.findOne({ ip })
        return found?.isBanned || false;
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

module.exports = new BanService(BanModel)

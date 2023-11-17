class BanService{
    constructor(Ban){
        this.ban = Ban;
    }

    async isBanned(ip){
        const found = this.ban.findOne({ ip })
        return found && found.isBanned;
    }

    async warn(ip){
        const warned = this.ban.findOneAndUpdate({ ip }, {$inc : {count : 1}}, { upsert:true, new:true });
        
        if(warned.count >= 3){
            warned.date = new Date();
            await warned.save();
            return { banned: true }
        }

        return { banned: false }
    }
}


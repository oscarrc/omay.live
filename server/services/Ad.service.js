class AdService{
    constructor(url){
        this.url = url;
    }

    async getAds(zones, ip){
        const query = zones.reduce( (a, v, i) => a + `zone[${i}][idzone]=${v}&`, "?v=1&") + `user_ip=${ip}`
        const res = await fetch(url + query, {
            method: "GET"
        })

        const ads = await res.json();

        return ads;
    }
}

export default new AdService(process.env.NEVERBLOCK_URL)

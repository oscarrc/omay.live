class AdService{
    constructor(url){
        this.url = url;
    }

    async getAds(zones, ip){
        const query = zones.reduce( (a, v, i) => a + `zones[${i}][idzone]=${v}&`, "?v=1&") + `user_ip=${ip}`

        const res = await fetch(this.url + query, {
            method: "GET"
        })

        let ads = await res.json();

        if(!ads?.zones) ads = { zones:[false] }

        await Promise.all(
            ads.zones.map( async (z) => {
                if(z === false || !z.data?.image) return z;
                
                let res = await fetch(z.data.image, { mode : 'no-cors' });
                let blob = await res.blob();
                let arrayBuffer = await blob.arrayBuffer();
                
                z.data.image = `data:image/${z.data.image.split(".").pop()};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                return z;
            })
        )

        return ads;
    }
}

export default new AdService(process.env.NEVERBLOCK_URL)

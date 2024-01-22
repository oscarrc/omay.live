class AdService{
    constructor(url){
        this.url = url;
    }

    async getAds(zones, ip){
        const query = zones.reduce( (a, v, i) => a + `zones[${i}][idzone]=${v}&`, "?v=1&") + `user_ip=${ip}`
        console.log(query)
        const res = await fetch(this.url + query, {
            method: "GET"
        })

        const ads = await res.json();

        await Promise.all(
            ads.zones.map( async (z) => {
                if(!z.data?.image) return z;
                
                let res = await fetch(z.data.image, { mode : 'no-cors' });
                let blob = await res.blob();
                let arrayBuffer = await blob.arrayBuffer();
                
                z.data.image = `data:image/${z.data.image.split(".").pop()};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
                return z;
            })
        )

        // await Promise.all(
        //     Object.keys(ads.renderers).forEach( async (k) => {
        //         let res = await fetch(z.data.image, { mode : 'no-cors' });
        //     })
        // )

        return ads;
    }
}

export default new AdService(process.env.NEVERBLOCK_URL)

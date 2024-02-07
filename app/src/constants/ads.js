const ADS = {
    video: {
        unmoderated: 5167944,
        moderated: 5173702
    },
    videoBanner:{
        unmoderated: 5184560,
        moderated: 5184562
    },
    pagePush:{
        unmoderated: 5172336,
        moderated: 5186226
    },
    banner: {
        unmoderated: {
            desktop: 5186222,
            mobile: 5186224
        },
        moderated: {
            desktop: 5167958,
            mobile: 5171914
        }
    }
}

const URLS = {
    adProvider: "https://a.magsrv.com/ad-provider.js",
    vastProvider: "https://s.magsrv.com/splash.php",
    imaSDK: "https://imasdk.googleapis.com/js/sdkloader/ima3.js"
}

const AD_DELAY = 5
const ADBLOCK_TIMER = 10

export {ADS, URLS, AD_DELAY, ADBLOCK_TIMER }
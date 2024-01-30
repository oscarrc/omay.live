import AdAlt from "./AdAlt";
import AdMain from "./AdMain"
import { useAdblockDetection } from "../../hooks/useAdblockDetection";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useEffect } from "react";

const Ad = ({zoneId, keywords, sub, className, video}) => {    
    const { cookieConsent: { targeting } } = useCookieConsent();
    const hasAdblock = useAdblockDetection();

    useEffect(() => {
        if(!video || (!hasAdblock && targeting)) return;
        
        let count = import.meta.env.VITE_ADBLOCK_TIMER * 100
        let timer = setInterval(() => {
            count -= 1
            if (count > 0) setCountDown(count - 1);
            else {
                clearInterval(timer);
                setCountDown(10);
                onAdEnd();
            }
        }, 10);

        video.onAdStarted && video.onAdStarted();
        
        return () => { clearTimeout(timer) }
    }, [hasAdblock, targeting])

    if(video) return (
        <AdVast {...video} >
            {
                (hasAdblock || !targeting) &&
                    <div className="flex flex-col gap-4 justify-center items-center relative h-full w-full text-base-100 p-4 text-center">
                        <AdAlt zoneId={ADS.videoBanner[isUnmoderated ? "unmoderated" : "moderated"]} className="responsive justify-center items-center">
                            {
                                hasAdBlock && 
                                    <div className="text-base-100 text-center">
                                        <h4 className="text-2xl font-bold">{t("common.alerts.adblockdetected")}</h4>
                                        <p>{t("common.alerts.disableadblock")}</p>
                                    </div>
                            }
                        </AdAlt>
                        <span className="absolute bottom-0 left-0 h-2 bg-primary" 
                            style={{
                                width: `${countdown / 10}%`
                            }}
                        ></span>
                    </div>
            }
        </AdVast>
    )   

    if(targeting && !hasAdblock) return <AdMain zoneId={zoneId} keywords={keywords} sub={sub} className={className} />

    return (
        <AdAlt zoneId={zoneId} className={className}>
            { hasAdblock && <AdBlock /> }
        </AdAlt>
    )
}

export default Ad;
import { useEffect, useState } from "react";

import AdAlt from "./AdAlt";
import AdBlock from "./AdBlock";
import AdMain from "./AdMain";
import AdVast from "./AdVast";
import { useAdblockDetection } from "../../hooks/useAdblockDetection";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useTranslation } from "react-i18next";

const Ad = ({zoneId, fallbackId, keywords, sub, className, video, listeners}) => {    
    const { cookieConsent: { targeting } } = useCookieConsent();
    const hasAdblock = useAdblockDetection();
    const { t } = useTranslation();
    const [ countdown, setCountdown ] = useState(10)

    useEffect(() => {
        if(!video || (!hasAdblock && targeting)) return;
        
        let count = import.meta.env.VITE_ADBLOCK_TIMER * 100
        let timer = setInterval(() => {
            count -= 1
            if (count > 0) setCountdown(count - 1);
            else {
                clearInterval(timer);
                setCountdown(10);
                listeners?.onAdCompleted && listeners.onAdCompleted();
            }
        }, 10);

        listeners?.onAdStarted && listeners.onAdStarted();
        
        return () => { clearTimeout(timer) }
    }, [hasAdblock, targeting])
    
    if(video){
        if(targeting && ! hasAdblock) return <AdVast videoRef={video} zoneId={zoneId} className={className} loadable={!hasAdblock && targeting} {...listeners} />
        return(
            <div className={className}>
                <div className="flex flex-col gap-4 justify-center items-center relative h-full w-full p-4 text-center">
                    <AdAlt zoneId={fallbackId || zoneId} className="responsive justify-center items-center">
                        {
                            hasAdblock &&
                                <div className="text-center">
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
            </div>
        )
    }
    
    if(targeting && !hasAdblock) return <AdMain zoneId={fallbackId || zoneId} keywords={keywords} sub={sub} className={className} />

    return (
        <AdAlt zoneId={zoneId} className={className}>
            { hasAdblock && <AdBlock /> }
        </AdAlt>
    )
}

export default Ad;
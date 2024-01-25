import { AdAlt, Loader } from "../partials";
import { useEffect, useRef, useState } from "react";

import ADS from "../../constants/ads";
import { useAdblockDetection } from "../../hooks/useAdblockDetection";
import { useTranslation } from "react-i18next";
import useVast from "../../hooks/useVast";

const VideoBox = ({ source, muted, className, loading, withAds, playAd, isUnmoderated, onAdStart, onAdEnd, onAdError }) => {
    const player = useRef(null);
    const container = useRef(null);
    const hasAdblock = useAdblockDetection();
    const [ countdown, setCountDown ] = useState(10);
    const { t } = useTranslation()
    const { adsManager, loadAd } = useVast(player, container, import.meta.env.VITE_VAST_TAG, ADS.video[isUnmoderated ? "unmoderated" : "moderated"] )
    
    useEffect(() => {
        player.current.srcObject = source;
    }, [source])

    useEffect(() => {
        if(!playAd || !hasAdblock) return;
        
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

        onAdStart();
        return () => { clearTimeout(timer) }
    }, [playAd, hasAdblock])

    useEffect(() => {
        if(!withAds || !adsManager) return;
        if(!playAd) container.current.replaceChildren();

        loadAd();
        onAdStart && adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStart);
        onAdEnd && adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEnd);
        onAdEnd && adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdEnd);
        !hasAdblock && onAdError && adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

        return () => {
            if(!withAds || !adsManager) return;
            onAdStart && adsManager.removeEventListener(google.ima.AdEvent.Type.STARTED, onAdStart);
            onAdEnd && adsManager.removeEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEnd);
            onAdEnd && adsManager.removeEventListener(google.ima.AdEvent.Type.SKIPPED, onAdEnd);
            !hasAdblock && onAdError && adsManager.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.destroy();
        }
    }, [playAd, withAds, adsManager])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
            { loading && <Loader className="absolute h-full top-0 left-0" /> }
            { withAds && 
                <div ref={container} className="absolute w-full h-full top-0 left-0">
                    {
                        playAd && hasAdblock &&
                            <div className="flex flex-col gap-4 justify-center items-center relative h-full w-full text-base-100 p-4 text-center">
                                <AdAlt zoneId={ADS.videoBanner[isUnmoderated ? "unmoderated" : "moderated"]} className="responsive justify-center items-center">
                                    <>
                                        <h4 className="text-2xl font-bold">{t("common.alerts.adblockdetected")}</h4>
                                        <p>{t("common.alerts.disableadblock")}</p>
                                    </>
                                </AdAlt>
                                <span className="absolute bottom-0 left-0 h-2 bg-primary" style={{
                                    width: `${countdown / 10}%`
                                }}> </span>
                            </div>
                    }
                </div>
            }
        </div>
    )
}

export default VideoBox;
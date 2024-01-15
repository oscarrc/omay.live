import { useEffect, useRef } from "react";

import { Loader } from "../partials";
import useVast from "../../hooks/useVast";

const VideoBox = ({ source, muted, className, loading, withAds, playAd, onAdStart, onAdEnd, onAdError }) => {
    const player = useRef(null);
    const container = useRef(null);
    const { adsManager, loadAd } = useVast(player, container, import.meta.env.VITE_VAST_TAG)
    
    useEffect(() => {
        player.current.srcObject = source;
    }, [source])

    useEffect(() => {
        if(!withAds || !adsManager) return;
        if(!playAd) return;

        loadAd();
        onAdStart && adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStart);
        onAdEnd && adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEnd);
        onAdEnd && adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdEnd);
        onAdError && adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

        return () => {
            if(!withAds || !adsManager) return;
            onAdStart && adsManager.removeEventListener(google.ima.AdEvent.Type.STARTED, onAdStart);
            onAdEnd && adsManager.removeEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEnd);
            onAdEnd && adsManager.removeEventListener(google.ima.AdEvent.Type.SKIPPED, onAdEnd);
            onAdError && adsManager.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.destroy();
        }
    }, [playAd, withAds, adsManager])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
            { loading && <Loader className="absolute h-full top-0 left-0" /> }
            { withAds && <div ref={container} className="absolute w-full h-full top-0 left-0"></div> }
        </div>
    )
}

export default VideoBox;
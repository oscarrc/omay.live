import { useEffect, useRef } from "react";

import { ADS } from "../../../constants/ads";
import Ad from "../../../components/ad"
import { BRAND } from "../../../constants/brand.js";
import { Loader } from "../../../components/partials";
import { STATUS } from "../../../constants/chat";
import { useChat } from "../../../hooks/useChat";

const VideoBox = ({ source, muted, className, loading, withAds, playAd, isUnmoderated, withBrand }) => {
    const player = useRef(null);
    const { dispatch } = useChat();

    useEffect(() => {
        player.current.srcObject = source;
    }, [source])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
            { withBrand && !playAd && <span className="logo absolute left-2 bottom-2 text-warning text-2xl">{BRAND}</span> }
            { loading && <Loader className="absolute h-full top-0 left-0" /> }
            {
                withAds && playAd &&
                    <Ad
                        zoneId={ADS.video[isUnmoderated ? "unmoderated" : "moderated"]}
                        fallbackId={ADS.videoBanner[isUnmoderated ? "unmoderated" : "moderated"]}
                        video={player}
                        listeners={{
                            onAdStarted: () => { dispatch({ type: "STATUS", payload: STATUS.ADPLAYING }) },
                            onAdCompleted: () => { dispatch({ type: "STATUS", payload: STATUS.STOPPED }) },
                            onAdSkipped: () => { dispatch({ type: "STATUS", payload: STATUS.STOPPED }) },
                            onAdError: () => { dispatch({ type: "STATUS", payload: STATUS.STOPPED }) }
                        }}
                        className="absolute w-full h-full top-0 left-0 text-base-100"
                    />
            }
        </div>
    )
}

export default VideoBox;
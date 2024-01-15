import { useEffect, useRef } from "react";

import { Loader } from "../partials";
import useVast from "../../hooks/useVast";

const VideoBox = ({ source, muted, className, loading, ads }) => {
    const player = useRef(null);
    const container = useRef(null);
    const { adsManager, loadAd } = useVast(player, container, import.meta.env.VITE_VAST_TAG)
    
    useEffect(() => {
        player.current.srcObject = source;
    }, [source])

    useEffect(() => {
        ads && adsManager && loadAd();
    }, [ads, adsManager])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
            { loading && <Loader className="absolute h-full top-0 left-0" /> }
            { ads && <div ref={container} className="absolute w-full h-full top-0 left-0"></div> }
        </div>
    )
}

export default VideoBox;
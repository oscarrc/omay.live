import { useEffect, useRef } from "react";

import Loader from "../partials/Loader";

const VideoBox = ({ source, muted, className, loading }) => {
    const player = useRef(null);

    useEffect(() => {
        if(!source) return;
        player.current.srcObject = source;
    }, [source])

    return (
        <div className={`relative flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner aspect-4/3 overflow-hidden ${className}`}>
            { !source && loading && 
                <div className="absolute flex w-full h-full top-0 left-0 ">
                    <Loader /> 
                </div>
            }
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="w-full"/>
        </div>
    )
}

export default VideoBox;
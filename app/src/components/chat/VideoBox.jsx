import { useEffect, useRef } from "react";

const VideoBox = ({ source, muted, className }) => {
    const player = useRef(null);

    useEffect(() => {
        if(!source) return;
        player.current.srcObject = source;
    }, [source])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner aspect-4/3 overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
        </div>
    )
}

export default VideoBox;
import { useEffect, useRef } from "react";

const VideoBox = ({ source, muted, className }) => {
    const player = useRef(null);

    useEffect(() => {
        player.current.srcObject = source;
    }, [source])

    return (
        <div className={`flex items-center justify-center bg-neutral sm:rounded-lg shadow-inner overflow-hidden ${className}`}>            
            <video ref={player} autoPlay={true} playsInline={true} muted={muted} className="h-full w-auto" />
        </div>
    )
}

export default VideoBox;
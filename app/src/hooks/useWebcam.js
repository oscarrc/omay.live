import { useEffect, useRef, useState } from "react";

const opts = {
    video: {
        facingMode: 'user'
    },
    audio: true
}

const useWebcam = () => {
    const stream = useRef(null);
    const [cam, setCam ] = useState(null);
    const [camError, setCamError] = useState(false)

    const startCam = async () => {
        try{
            stream.current = await navigator.mediaDevices.getUserMedia(opts);
            setCam(stream.current);
            setCamError(false)
        }catch(e){
            setCamError(true);
        }       
    }

    const stopCam = () => {
        stream.current?.getTracks().forEach(track => track.stop());
        stream.current = null
        setCam(null)
    }

    useEffect(() => () => stopCam(), [])

    return { cam, camError, startCam }
}

export default useWebcam;
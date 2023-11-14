import { useEffect, useRef, useState } from "react";

const opts = {
    video: {
        facingMode: 'user'
    },
    audio: true
}

const useWebcam = () => {
    const [cam, setCam] = useState(null);
    const unmounting = useRef(false);

    const init = async () => {
        try{
            const stream = await navigator.mediaDevices.getUserMedia(opts);
            setCam(stream);
        }catch(e){
            console.log(e)
        }       
    }

    const stop = () => {
        cam?.getTracks().forEach(track => track.stop());
        setCam(null);
    }

    useEffect(() => init(), [])
    useEffect(() => () => (unmounting.current = true), [])
    useEffect(() => () => (unmounting.current && stop()), [cam])

    return { cam }
}

export default useWebcam;
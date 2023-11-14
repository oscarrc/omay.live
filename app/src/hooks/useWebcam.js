import { useEffect, useState } from "react";

const opts = {
    video: {
        facingMode: 'user'
    },
    audio: true
}

const useWebcam = () => {
    const [cam, setCam] = useState(null);
    
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

    useEffect(() => { init() }, [])

    return { cam }
}

export default useWebcam;
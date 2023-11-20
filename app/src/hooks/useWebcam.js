import { CAMERA_OPTIONS, VIRTUAL_CAMS } from "../constants/chat";
import { useEffect, useRef, useState } from "react";

const useWebcam = () => {
    const stream = useRef(null);
    const [cam, setCam ] = useState(null);
    const [camError, setCamError] = useState(false);

    const startCam = async () => {
        try{
            stream.current = await navigator.mediaDevices.getUserMedia(CAMERA_OPTIONS);
            setCam(stream.current);
            setCamError(false)
        }catch(e){
            setCamError(true);
        }       
    }

    const stopCam = () => {
        stream.current?.getTracks().forEach(track => track.stop());
        stream.current = null
        setCam(null);
    }

    const checkVirtual = () => {
        const label = stream.current.getVideoTracks()[0].label
        return VIRTUAL_CAMS.find( v => new RegExp(v, 'i').test(label))
    }

    const getImg = () => {
        const { width, height } = stream.current.getVideoTracks()[0].getSettings();

        const canvas = document.createElement("canvas"); 
        canvas.width = width;
        canvas.height = height;

        const video = document.createElement("video");
        video.srcObject = stream.current;
      
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, width, height);

        const data = canvas.toDataURL("image/png");
        console.log(data)
        const img = document.createElement("img");

        img.src = data;

        return img;
    }

    useEffect(() => () => stopCam(), [])

    return { cam, camError, startCam, getImg }
}

export default useWebcam;
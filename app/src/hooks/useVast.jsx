import { useEffect, useState } from "react";

const useVast = (videoRef, containerRef, tagUrl, zoneId) => {
    const [ adsManager, setAdsManager ] = useState(null);
    const [ adsContainer, setAdsContainer ] = useState(null);

    const loadAd = (cb) => {
        let width = videoRef.current.clientWidth;
        let height = videoRef.current.clientHeight;

        adsContainer.initialize();
        
         try {
            adsManager.init(width, height, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (adError) {
            console.log("AdsManager could not be started");
            cb && cb();
        }
    }

    const initIma = () => {     
        let adContainer = containerRef.current;
        let videoElement = videoRef.current;
        let adDisplayContainer = new google.ima.AdDisplayContainer(adContainer, videoElement);
        let adsLoader = new google.ima.AdsLoader(adDisplayContainer);
        let adsRequest = new google.ima.AdsRequest();
        
        const videoComplete = () => adsLoader.contentComplete();
        
        const adsLoaded = (event) => {  
            let adsManager = event.getAdsManager(videoElement);
            setAdsManager(adsManager);
            setAdsContainer(adDisplayContainer);
        }

        videoElement.addEventListener('ended', videoComplete);
        
        adsRequest.adTagUrl = tagUrl + zoneId;
        adsRequest.linearAdSlotWidth = videoElement.clientWidth;
        adsRequest.linearAdSlotHeight = videoElement.clientHeight;
        adsRequest.nonLinearAdSlotWidth = videoElement.clientWidth;
        adsRequest.nonLinearAdSlotHeight = videoElement.clientHeight / 3;

        adsLoader.requestAds(adsRequest);
        adsLoader.addEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, adsLoaded, false)

        return () => {
            videoElement.removeEventListener('ended', videoComplete);            
            adsLoader.removeEventListener(google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED, adsLoaded, false)
        }
    }

    useEffect(() => {
        let url = import.meta.env.VITE_IMA_SDK;
        let script = document.querySelector(`script[src="${url}"]`);
        
        if(!url || script) return;
        
        script = document.createElement("script");
        script.src = url;
        script.async = true;
        script.onload = initIma;
        
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script)
        }
    }, [])   

    useEffect(() => {
        if(!adsManager) return;

        const videoElement = videoRef.current;
        const resizeHandler = () => {
            let width = videoElement.clientWidth;
            let height = videoElement.clientHeight;
            adsManager.resize(width, height, google.ima.ViewMode.NORMAL);
        }

        window.addEventListener("resize", resizeHandler);

        return () => {
            window.removeEventListener("resize", resizeHandler)
        }
    }, [adsManager])

    return { adsManager, loadAd };
}

export default useVast
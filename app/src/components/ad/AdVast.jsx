import { useEffect, useRef, useState } from "react";

const AdVast = (videoRef, zoneId, className, onAdStarted, onAdCompleted, onAdError, onAdSkipped, children) => {
    const [ adsManager, setAdsManager ] = useState(null);
    const [ adsContainer, setAdsContainer ] = useState(null);
    const containerRef = useRef(null);

    const loadAd = () => {
        let width = videoRef.current.clientWidth;
        let height = videoRef.current.clientHeight;

        adsContainer.initialize();
        
         try {
            adsManager.init(width, height, google.ima.ViewMode.NORMAL);
            adsManager.start();
        } catch (adError) {
            console.log("AdsManager could not be started");
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
        
        adsRequest.adTagUrl = import.meta.env.VITE_VAST_TAG + zoneId;
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

    useEffect(() => {        
        if(!adsManager) return;
        loadAd();
        onAdStarted && adsManager.addEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted);
        onAdCompleted && adsManager.addEventListener(google.ima.AdEvent.Type.COMPLETE, onAdCompleted);
        onAdSkipped && adsManager.addEventListener(google.ima.AdEvent.Type.SKIPPED, onAdSkipped);
        onAdError && adsManager.addEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);

        return () => {
            if(!adsManager) return;
            onAdStarted && adsManager.removeEventListener(google.ima.AdEvent.Type.STARTED, onAdStarted);
            onAdEnded && adsManager.removeEventListener(google.ima.AdEvent.Type.COMPLETE, onAdEnded);
            onAdSkipped && adsManager.removeEventListener(google.ima.AdEvent.Type.SKIPPED, onAdSkipped);
            onAdError && adsManager.removeEventListener(google.ima.AdErrorEvent.Type.AD_ERROR, onAdError);
            adsManager.destroy();
        }
    }, [adsManager])

    return (
        <div ref={containerRef} className={className}>  
            { children }
        </div>
    )
}

export default AdVast
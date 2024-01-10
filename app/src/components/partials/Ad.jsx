import { forwardRef, useEffect } from "react";

const Ad = forwardRef(({zoneId, keywords, className}, ref) => {
    useEffect(() => {
        window.AdProvider = window.AdProvider || [];
    }, []);

    useEffect(() => {
        let script = document.querySelector(`script[src="${import.meta.env.VITE_ADS_URL}"]`);
        if(script) return
        
        script = document.createElement("script");
        script.src = import.meta.env.VITE_ADS_URL;
        script.async = true;    
        script.onload = () => {            
            window.AdProvider = window.AdProvider || [];
            window.AdProvider.push({ serve: {} });
        }
        
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script)
        }
    }, [])

    useEffect(() => {
        window.AdProvider.push({ serve: {} });
    }, [zoneId])

    return (
        <div className={`ad ${className}`} ref={ref}>
            <ins 
                className="adsbyexoclick"
                data-zoneid={`${zoneId}`} 
                {...(keywords ? { "data-keywords": keywords.join(",") } : {} ) }           
            ></ins> 
        </div>
    )
})

export default Ad;
import { useEffect } from "react";

const AdMain = ({zoneId, keywords, sub, className}) => {
    useEffect(() => {
        window.AdProvider = window.AdProvider || [];
    }, []);

    useEffect(() => {
        let url = import.meta.env.VITE_ADS_URL;
        let script = document.querySelector(`script[src="${url}"]`);
        if(script || !url) return
        
        script = document.createElement("script");
        script.src = url;
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
        <div className={`ad ${className}`}>
            <ins 
                className="adsbyexoclick"
                data-zoneid={`${zoneId}`} 
                {...(keywords ? { "data-keywords": keywords.join(",") } : {}) }       
                {...(sub ? {...sub.slice(0,3).reduce((a,v,i) => ({ ...a, [`data-sub${i ? i + 1 : ""}`]: v}), {}) } : {}) }  
            ></ins> 
        </div>
    )
}

export default AdMain;
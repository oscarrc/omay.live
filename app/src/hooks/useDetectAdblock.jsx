import { useEffect, useState } from "react";

const useDetectAdblock = () => {
    const [adBlockDetected, setAdBlockDetected] = useState(false);

    useEffect(() => {
        const url = import.meta.env.VITE_ADS_URL;
        fetch(url, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
        }).then(({ redirected }) => {
            if (redirected) setAdBlockDetected(true);
        }).catch(() => {
            setAdBlockDetected(true);
        });
    }, []);

    return adBlockDetected;
}

export default useDetectAdblock;
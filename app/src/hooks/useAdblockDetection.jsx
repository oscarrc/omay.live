import { createContext, useContext, useEffect, useState } from "react";

import { URLS } from "../constants/ads";

const AdblockDetectionContext = createContext(null)

const AdblockDetectionProvider = ({ children }) => {
    const [hasAdblock, setHasAdblock] = useState(false);

    useEffect(() => {
        const url = URLS.adProvider;
        fetch(url, {
            method: "HEAD",
            mode: "no-cors",
            cache: "no-store",
        }).then(({ redirected }) => {
            if (redirected) setHasAdblock(true);
        }).catch(() => {
            setHasAdblock(true);
        });
    }, []);

    return (
        <AdblockDetectionContext.Provider value={ hasAdblock }>
            { children }
        </AdblockDetectionContext.Provider>
    )
}

const useAdblockDetection = () => {
    const context = useContext(AdblockDetectionContext);
    if(context === undefined) throw new Error("useAdblockDetection must be used within a AdblockDetectionProvider")
    return context;
}

export { AdblockDetectionProvider, useAdblockDetection }
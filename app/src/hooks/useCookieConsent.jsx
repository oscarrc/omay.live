import { createContext, useEffect, useState } from "react";

const CookieConsentContext = createContext(null);

const CookieConsentProvider = ({children}) => {
    const [ cookieConsent, setCookieConsent ] = useState(false);

    const getConsent = () => {
        return document.cookie.split("; ").find((row) => row.startsWith("cc="))?.split("=")[1] || false;
    }

    const setConsent = (value) => {
        document.cookie = `name=cc; value=${value} SameSite=None; Path=/`;
    }

    useEffect(() => {
        let cc = getConsent();
        setCookieConsent(cc);
    }, [])

    return (
        <CookieConsentContext.Provider value={{
            cookieConsent,
            setConsent
        }}>
            { children }
        </CookieConsentContext.Provider>
    )
}

const useCookieConsent = () => {
    const context = useContext(CookieConsentContext);
    if(context === undefined) throw new Error("useCookieConsent must be used within a CookieConsentProvider")
    return context;
}

export { CookieConsentProvider, useCookieConsent }
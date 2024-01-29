import { createContext, useContext, useEffect, useState } from "react";

const CookieConsentContext = createContext(null);

const CookieConsentProvider = ({children}) => {
    const [ cookieConsent, setCookieConsent ] = useState({ targeting: false });
    const [ manage, setManage ] = useState(false);

    const getConsent = () => {
        return document.cookie.split("; ").find((row) => row.startsWith("cc="))?.split("=")[1] || false;
    }

    const setConsent = (value) => {
        let v = JSON.stringify(value)
        document.cookie = `name=cc; value=${v} SameSite=None; Path=/`;
    }

    useEffect(() => {
        let cc = getConsent();
        if(cc) setCookieConsent(JSON.parse(cc));
        else setManage(true);
    }, [])

    return (
        <CookieConsentContext.Provider value={{
            cookieConsent,
            setConsent,
            setManage,
            manage
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
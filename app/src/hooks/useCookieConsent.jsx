import { createContext, useContext, useEffect, useState } from "react";

const CookieConsentContext = createContext(null);

const CookieConsentProvider = ({children}) => {
    const [ cookieConsent, setCookieConsent ] = useState({ targeting: false });
    const [ manage, setManage ] = useState(false);

    const getCookie = (name) => {
        let matches = document.cookie.match(new RegExp(
          "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    const setCookie = (name, value, options = {}) => {
        options = {
          path: '/',
          ...options
        };
      
        if (options.expires instanceof Date) {
          options.expires = options.expires.toUTCString();
        }
      
        let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
      
        for (let optionKey in options) {
          updatedCookie += "; " + optionKey;
          let optionValue = options[optionKey];
          if (optionValue !== true) {
            updatedCookie += "=" + optionValue;
          }
        }
      
        document.cookie = updatedCookie;
    }
      
    const setConsent = (value) => {
        let v = JSON.stringify(value)
        setCookie("cc", v)
    }

    useEffect(() => {
        let cc = JSON.parse(getCookie("cc"));
        if(cc?.targeting) setCookieConsent(cc);
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
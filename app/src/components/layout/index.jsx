import { Suspense, useEffect, useRef } from "react";

import CookieConsent from "../modals/CookieConsent";
import Footer from "./Footer";
import Header from "./Header";
import Loader from "../partials/Loader";
import { Outlet } from "react-router-dom";
import { useChat } from "../../hooks/useChat";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

const Layout = ({ children }) => {    
    const { i18n } = useTranslation();
    const main = useRef(null);
    const { state: { lang, mode } } = useChat();
    const { manage, setManage, cookieConsent, setConsent } = useCookieConsent();
    
    const {data:count} = useQuery({
        queryKey: ["count", mode],
        queryFn: async () => {
            let res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat`, { method: "GET"})
            return (await res.json()).count
        },    
        initialData: 0,
    })

    useEffect(() => {
        main.current.dir = i18n.dir();
    }, [i18n.language])

    return (
        <>
            <Header count={count} lang={lang} />
            <main ref={main} className="flex flex-col flex-1 bg-base-200 sm:p-6 sm:pb-0">
                <Suspense fallback={<Loader />}>
                    { children ?? <Outlet /> }
                </Suspense>
            </main>
            <CookieConsent show={manage} value={cookieConsent} onSubmit={(v) => {setConsent(v); setManage(false)} } />
            <Footer />
        </>
    )
}

export default Layout;
import { Suspense, useEffect, useRef } from "react";

import Cookies from "./Cookies";
import Counter from "./Counter";
import Footer from "./Footer";
import Header from "./Header";
import Language from "./Language";
import { Link } from "react-router-dom";
import Loader from "../partials/Loader";
import { Outlet } from "react-router-dom";
import { PiCookie } from "react-icons/pi";
import { useChat } from "../../hooks/useChat";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useQuery } from "react-query";
import { useTranslation } from "react-i18next";

const Layout = ({ children }) => {    
    const { i18n, t } = useTranslation();
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
            <Header>
                <Counter count={count} />
                <Language lang={lang} />          
            </Header>
            <main ref={main} className="flex flex-col flex-1 bg-base-200 sm:p-6 sm:pb-0">
                <Suspense fallback={<Loader />}>
                    { children ?? <Outlet /> }
                </Suspense>
            </main>
            <Cookies show={manage} value={cookieConsent} onSubmit={(v) => {setConsent(v); setManage(false)} } />
            <Footer>                
                <Link to={"policies/terms-and-conditions"}>{ t("common.terms")}</Link>
                <Link to={"policies/privacy-policy"}>{ t("common.privacy")}</Link>
                <Link to={"policies/community-guidelines"}>{ t("common.guidelines")}</Link>
                <button onClick={() => setManage(true) } className="btn btn-xs btn-ghost btn-circle"><PiCookie className="h-4 w-4" /></button>
            </Footer>
        </>
    )
}

export default Layout;
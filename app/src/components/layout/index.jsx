import { Suspense, useEffect, useRef } from "react";

import Footer from "./Footer";
import Header from "./Header";
import Loader from "../partials/Loader";
import { Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Layout = ({ children }) => {    
    const { i18n } = useTranslation();
    const main = useRef(null);
    
    useEffect(() => {
        main.current.dir = i18n.dir();
    }, [i18n.language])

    return (
        <>
            <Header />
            <main ref={main} className="flex flex-col flex-1 bg-base-200 sm:p-6 sm:pb-0">
                <Suspense fallback={<Loader />}>
                    { children ?? <Outlet /> }
                </Suspense>
            </main>
            <Footer />
        </>
    )
}

export default Layout;
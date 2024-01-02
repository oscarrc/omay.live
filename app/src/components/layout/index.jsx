import Footer from "./Footer";
import Header from "./Header";
import Loader from "../partials/Loader";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main className="flex flex-1 bg-base-200 sm:p-6 sm:pb-0">
                <Suspense fallback={<Loader />}>
                    { children ?? <Outlet /> }
                </Suspense>
            </main>
            <Footer />
        </>
    )
}

export default Layout;
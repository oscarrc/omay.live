import Footer from "./Footer";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Layout = ({ children }) => {
    return (
        <>
            <Header />
            <main className="flex flex-1 bg-base-200 p-6">
                { children ?? <Outlet /> }
            </main>
            <Footer />
        </>
    )
}

export default Layout;
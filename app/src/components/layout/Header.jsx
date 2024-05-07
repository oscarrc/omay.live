import {useEffect, useState} from "react";

import { BRAND } from "../../constants/brand";
import { Link } from "react-router-dom";

const Header = ({ children }) => {
    const [scrolled, setScrolled] = useState(false);
    
    useEffect(() => {
        const scroll = () => setScrolled(window.scrollY > 0);
        window.addEventListener("scroll", scroll);

        return () => { window.removeEventListener("scroll", scroll) }
    }, [])

    return (
        <header className="sticky top-0 bg-base-100 z-40">
            <nav className={`navbar transition-all duration-100	${scrolled ? "shadow-lg" : "shadow-none"}`}>
                <div className="flex gap-8 min-w-fit flex-1">
                    <Link to="/" className="indicator logo btn btn-ghost text-warning text-2xl md:text-4xl py-2 relative">
                        <img src="/logo.svg" alt={`${BRAND} logo`} className="h-full rounded-md"/>
                        { BRAND }
                        { import.meta.env.VITE_IS_BETA ? <span class="indicator-item badge badge-primary badge-xs text-white">beta</span>  : "" }
                    </Link>
                    <span className="hidden md:inline -rotate-6 text-primary text-sm lg:text-xl font-bold">Live with strangers!</span>
                </div>
                <div className="flex gap-8 flex-shrink px-4">
                    { children }                      
                </div>
            </nav>
        </header>
    )
}

export default Header;
import {useEffect, useState} from "react";

import { BRAND } from "../../constants/brand";
import { LanguageSelector } from "../partials";
import { Link } from "react-router-dom";
import { useChat } from "../../hooks/useChat";

const Header = () => {
    const { state: { lang }, count } = useChat();
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
                    <Link to="/" className="btn btn-ghost text-warning text-2xl uppercase py-2">
                        <img src="/logo.svg" alt={`${BRAND} logo`} className="h-full"/>
                        { BRAND }
                    </Link>
                    <span className="hidden md:inline -rotate-6 text-primary text-sm lg:text-xl font-bold">Connect with strangers!</span>
                </div>
                <div className="flex gap-8 flex-shrink px-4">
                    <div className="whitespace-nowrap text-primary text-lg font-bold hidden sm:inline">
                        <span className="text-2xl">{count}+</span> Online now
                    </div>   
                    <LanguageSelector lang={lang} />                                
                </div>
            </nav>
        </header>
    )
}

export default Header;
import { BRAND } from "../../constants/strings";
import { Link } from "react-router-dom";

const Header = () => {
    return (
        <header className="sticky top-0 bg-base-100 z-40">
            <nav className="navbar shadow-lg">
                <div className="flex gap-8 flex-1">
                    <Link to="/" className="btn btn-ghost text-warning text-xl uppercase py-2">
                        <img src="./logo.svg" alt={BRAND} className="h-full"/>
                        { BRAND }
                    </Link>
                    <span className="hidden md:inline -rotate-6 text-primary lg:text-xl font-bold">Connect with strangers!</span>
                </div>
                <div className="flex gap-8 flex-none px-4">
                    <div className="whitespace-nowrap text-primary text-lg font-bold hidden sm:inline">
                        <span className="text-2xl">10000+</span> Online now
                    </div>   
                    <select className="select select-bordered select-sm w-full max-w-xs">
                        <option disabled selected>Select language</option>
                    </select>                                  
                </div>
            </nav>
        </header>
    )
}

export default Header;
import { BRAND } from "../../constants/strings";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer flex flex-col md:flex-row justify-between items-center gap-0 md:justify-between bg-base-200 px-8 py-2">
            <p className="text-center md:text-left">Copyright © { (new Date() ).getFullYear() } - All right reserved by { BRAND }</p>
            <div className="flex flex-col items-center sm:flex-row gap-0 sm:gap-4">
                <Link to={"policies/terms-and-conditions"}>Terms and conditions</Link>
                <Link to={"policies/privacy-policy"}>Privacy policy</Link>
                <Link to={"policies/community-guidelines"}>Community guidelines</Link>
            </div>
        </footer>
    )
}

export default Footer;
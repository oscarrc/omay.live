import { BRAND } from "../../constants/strings";
import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer flex justify-between bg-base-200 px-6 py-2">
            <p>Copyright © { (new Date() ).getFullYear() } - All right reserved by { BRAND }</p>
            <div className="flex gap-4">
                <Link to={"terms-and-conditions"}>Terms and conditions</Link>
                <Link to={"privacy-policy"}>Privacy policy</Link>
                <Link to={"community-guidelines"}>Community guidelines</Link>
            </div>
        </footer>
    )
}

export default Footer;
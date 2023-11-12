import { BRAND } from "../../constants/strings";

const Footer = () => {
    return (
        <footer className="footer flex justify-between bg-base-200 px-6 py-2">
            <p>Copyright © { (new Date() ).getFullYear() } - All right reserved by { BRAND }</p>
            <div className="flex gap-4">
                <a>Terms and conditions</a>
                <a>Privacy policy</a>
                <a>Community guidelines</a>
            </div>
        </footer>
    )
}

export default Footer;
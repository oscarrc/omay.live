import { BRAND } from "../../constants/brand";
import { useTranslation } from "react-i18next";

const Footer = ({ children }) => {
    const { t } = useTranslation();

    return (
        <footer className="footer flex flex-col justify-center xl:flex-row flex-wrap items-center gap-2 bg-base-200 px-8 py-2">
            <p className="text-center lg:text-left flex-1">Copyright © { (new Date() ).getFullYear() } { BRAND } - { t("common.allrightsreserved")}.</p>
            <div className="flex flex-col items-center md:flex-row gap-2 sm:gap-4">
                { children }
            </div>
        </footer>
    )
}

export default Footer;
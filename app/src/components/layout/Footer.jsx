import { BRAND } from "../../constants/brand";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="footer flex flex-col md:flex-row justify-between items-center gap-0 md:justify-between bg-base-200 px-8 py-2">
            <p className="text-center md:text-left">Copyright © { (new Date() ).getFullYear() } { BRAND } - { t("common.allrightsreserved")}.</p>
            <div className="flex flex-col items-center sm:flex-row gap-0 sm:gap-4">
                <Link to={"policies/terms-and-conditions"}>{ t("common.terms")}</Link>
                <Link to={"policies/privacy-policy"}>{ t("common.privacy")}</Link>
                <Link to={"policies/community-guidelines"}>{ t("common.guidelines")}</Link>
            </div>
        </footer>
    )
}

export default Footer;
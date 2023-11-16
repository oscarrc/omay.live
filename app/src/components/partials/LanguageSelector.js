import { LOCALES } from "../../constants/locales"
import { useState } from "react";
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const [any, setAny] = useState(false)
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        const lang = e.target.value === "any" ? "en" : e.target.value;
        setAny(e.target.value === "any" )
        i18n.changeLanguage(lang)
    }

    return (
        <select onChange={handleLanguageChange} className="select select-bordered select-sm w-full max-w-xs">
            <option selected={any} value="en">Any</option>
            {
                Object.keys(LOCALES).map( l => <option selected={ l === i18n.language || l === i18n.language.split('-')[0] } key={l} value={l}>{LOCALES[l]}</option>)
            }
        </select>  
    )
}

export default LanguageSelector
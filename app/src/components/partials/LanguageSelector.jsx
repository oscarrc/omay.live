import { LOCALES } from "../../constants/locales"
import { useEffect } from "react";
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ lang }) => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    // useEffect(() => {
    //     document.body.dir = i18n.dir();
    // }, [i18n.language])

    return (
        <select value={lang} aria-label="language" onChange={handleLanguageChange} className="select select-bordered select-sm w-full max-w-xs">
            <option value="any" key="any">Any</option>
            {
                Object.keys(LOCALES).map( l => <option key={l} value={l}>{LOCALES[l]}</option>)
            }
        </select>
    )
}

export default LanguageSelector
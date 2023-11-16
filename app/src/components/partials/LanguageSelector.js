import { LOCALES } from "../../constants/locales"
import { useTranslation } from 'react-i18next';

const LanguageSelector = () => {
    const { i18n } = useTranslation();

    console.log(i18n.language)
    return (
        <select onChange={(e) => i18n.changeLanguage(e.target.value)} className="select select-bordered select-sm w-full max-w-xs">
            {
                Object.keys(LOCALES).map( l => <option selected={ l === i18n.language } key={l} value={l}>{LOCALES[l]}</option>)
            }
        </select>  
    )
}

export default LanguageSelector
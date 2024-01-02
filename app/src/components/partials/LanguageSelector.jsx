import { LOCALES } from "../../constants/locales"
import { useTranslation } from 'react-i18next';

const LanguageSelector = ({ lang }) => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value)
    }

    return (
        <select value={lang} onChange={handleLanguageChange} className="select select-bordered select-sm w-full max-w-xs">
            <option value="any" key="any">Any</option>
            {
                Object.keys(LOCALES).map( l => <option key={l} value={l}>{LOCALES[l]}</option>)
            }
        </select>
    )
}

export default LanguageSelector
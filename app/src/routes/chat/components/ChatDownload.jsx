import { useEffect, useRef } from "react";

import { BRAND } from "../../../constants/brand";
import { useTranslation } from "react-i18next";

const ChatDownload = ({ messages, lang }) => {
    const { t } = useTranslation();
    const link = useRef(null);

    useEffect(() => {
        let now = new Date()
        let date = now.toLocaleDateString([lang, "en"]);

        let content = messages.reduce((a, m) => {
            let time = (new Date(m.t)).toLocaleTimeString([lang, "en"]);
            return `${a}\t${m.me ? t("chat.you") : t("chat.stranger")} [${time}]: ${m.msg}\n`;            
        }, `${BRAND} log [${date}]\n\n`)

        var file = new Blob([content], {type: 'text/plain;charset=UTF-8'});
        let url = window.URL.createObjectURL(file);

        link.current.href = url;
        link.current.setAttribute(
            'download',
            `${BRAND}-${Date.now()}.txt`,
        );
    }, [])
    
    return (
        <label className="label-text">{t("chat.great")} <a ref={link} href="" className="btn inline btn-xs w-full text-xs self-end h-fit">{t("chat.save")}</a></label>
    )
}

export default ChatDownload;
import { useEffect, useRef } from "react";

import { ADS } from "../../../constants/ads"
import Ad from "../../../components/ad";
import { useDevice } from "../../../hooks/useDevice";
import { useTranslation } from "react-i18next";

const ChatBox = ({ messages, className, status, simulated, children, lang, common, ad, unmoderated }) => {     
    const { t } = useTranslation();    
    const { isMobile } = useDevice();
    const box = useRef(null);

    useEffect(() => {
        box.current.scroll({
            top: box.current.scrollHeight - box.current.clientHeight,
            behavior: "smooth"
        })
    }, [messages])

    return (
        <div ref={box} className={`bg-base-100 sm:rounded-lg shadow-inner py-2 pb-4 px-4 ${className}`}>
            <div className="flex flex-col flex-1 gap-4">
                { ad && 
                    <Ad className="responsive justify-start" 
                        zoneId={ADS.banner[unmoderated ? "unmoderated" : "moderated"][isMobile ? "mobile" : "desktop"]} 
                        keywords={common} 
                    /> 
                }
                <p><strong>{ t(`chat.${status}`) }</strong></p>
                <div>
                    {lang && <p>{ t(`chat.language`) }</p>}
                    {
                        common.length > 0 && 
                        <p>
                            { t(`chat.interest`) }
                            { common.map((c,i) => <span key={i} className="badge bg-base-200 mx-2">{c}</span> )}
                        </p>
                    }
                    {simulated && <p><strong>{ t(`chat.simulated`) }</strong></p>}
                </div>
                <div className="flex flex-1 flex-col justify-end">
                    {
                        messages.map( (m, i) => 
                            <p key={i}>
                                <strong className={`${ m.me ? "text-primary" : "text-error"} mr-1`}>
                                    {m.me ? t("chat.you") : t("chat.stranger") }: 
                                </strong>
                                {m.msg}
                            </p>
                        )
                    }
                </div>
            </div>
            { children }
        </div>
    )
}

export default ChatBox;
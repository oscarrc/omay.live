import { STATUS } from "../../constants/chat";
import { useTranslation } from "react-i18next";

const ChatBox = ({ messages, className, status, simulated }) => {     
    const { t } = useTranslation();

    return (
        <div className={`bg-base-100 sm:rounded-lg shadow-inner py-2 pb-4 px-4 ${className}`}>
            <p><strong>{ t(`chat.${STATUS[status]}`) }</strong></p>
            {simulated && <p><strong>{ t(`chat.simulated`) }</strong></p>}
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
    )
}

export default ChatBox;
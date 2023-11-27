import { STATUS } from "../../constants/chat";
import { useTranslation } from "react-i18next";

const ChatBox = ({ messages, className, status }) => {     
    const { t } = useTranslation();

    return (
        <div className={`bg-base-100 sm:rounded-lg shadow-inner py-2 px-4 ${className}`}>
            <p><strong>{ t(`chat.${STATUS[status]}`) }</strong></p>
            {
                messages.map( (m, i) => 
                    <p key={i}>
                        <strong className={`${ m.me ? "text-primary" : "text-error"} mr-1`}>
                            {m.me ? t("you") : t("stranger") }: 
                        </strong>
                        {m.msg}
                    </p>
                )
            }
        </div>
    )
}

export default ChatBox;
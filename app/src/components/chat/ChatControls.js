import { useRef } from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const ChatControls = ({ onChange, onSubmit, onStart, onStop }) => {
    const { t } = useTranslation();
    const textRef = useRef(null);
    const [status, setStatus] = useState(0);

    const onClick = () => {
        setStatus(s => s < 2 ? s+1 : 0)
        status === 0 && onStart();
        status === 2 && onStop();
    }

    const send = () => {
        onSubmit(textRef.current.value);
        textRef.current.value = "";
    }

    return (
        <div className="join w-full h-16">                   
            <button onClick={onClick} className={`join-item btn ${ status === 0 ? "btn-primary" : "bg-base-100"} h-full flex flex-col gap-1 w-24 rounded-none sm:rounded-lg`}>
                { status === 0 && t("chat.start") } 
                { status === 1 && t("chat.stop") } 
                { status === 2 && t("chat.really") } 
                <span className={`${status === 0 ? "text-base-100" : "text-primary"} text-xs`}>Esc</span>
            </button>
            <textarea ref={textRef} onChange={onChange} className="join-item flex-1 h-full textarea textarea-bordered textaerea-fixed rounded-none shadow-inner"/>
            <button onClick={send} className="join-item btn h-full flex flex-col gap-1 bg-base-100 w-24 rounded-none sm:rounded-lg">{t("chat.send")} <span className="text-primary text-xs">Enter</span></button>
        </div>
    )
}

export default ChatControls;
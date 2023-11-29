import { useCallback, useEffect, useRef } from "react";

import { useTranslation } from "react-i18next";

const ChatControls = ({ onClick, onChange, onSubmit, onStart, onStop, confirmation }) => {
    const { t } = useTranslation();
    const textRef = useRef(null);

    const skip = useCallback(() => {
        confirmation === 0 && onStart();
        confirmation === 2 && onStop();
        onClick(confirmation < 3 ? confirmation + 1 : 0)
    }, [confirmation, onClick, onStart, onStop])

    const send = useCallback(() => {
        if(textRef.current.value === "") return;
        onSubmit(textRef.current.value);
        textRef.current.value = "";
    }, [onSubmit])

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key !== "Escape" && e.key !== "Enter") return;
            
            e.preventDefault();
            e.key === "Escape" && skip();
            e.key === "Enter" && send();
        }
    
        document.addEventListener("keydown", handleKey);
        return () => {document.removeEventListener("keydown", handleKey)}        
    }, [send, skip])
   
    return (
        <div className="join w-full h-16">                   
            <button onClick={skip} className={`join-item btn ${ confirmation === 0 ? "btn-primary" : "bg-base-100"} h-full flex flex-col gap-1 w-24 rounded-none sm:rounded-lg`}>
                { confirmation === 0 && t("chat.start") } 
                { confirmation === 1 && t("chat.stop") } 
                { confirmation === 2 && t("chat.really") } 
                <span className={`${confirmation === 0 ? "text-base-100" : "text-primary"} text-xs`}>Esc</span>
            </button>
            <textarea ref={textRef} onChange={onChange} className="join-item flex-1 h-full textarea textarea-bordered textaerea-fixed rounded-none shadow-inner"/>
            <button onClick={send} className="join-item btn h-full flex flex-col gap-1 bg-base-100 w-24 rounded-none sm:rounded-lg">{t("chat.send")} <span className="text-primary text-xs">Enter</span></button>
        </div>
    )
}

export default ChatControls;
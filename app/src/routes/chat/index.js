import { ChatBox, ChatControls, VideoBox } from "../../components/chat";
import { InterestInput, Toggle } from "../../components/partials";
import { useEffect, useMemo } from "react";

import { MdReport } from "react-icons/md"
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Chat = () => {
    const { 
        state: { tac, mode, status, confirmation, interests, interest, auto }, 
        dispatch,
        createOffer, 
        connect, 
        checkNSFW,
        reportPeer,
        disconnect, 
        messages, 
        sendMessage, 
        stopStream, 
        startStream, 
        localStream, 
        remoteStream,
        closeConnection,
        isSimulated,
        isBanned
    } = useChat();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const isTextOnly = useMemo(()=> mode === "text", [mode]);

    const startSearch = async () => {
        if(isBanned) return;
        await checkNSFW();
        await createOffer();
    }

    useEffect(()=>{
        if(isBanned) return;
        if(!tac) navigate("/");
        else if(status !== 6) connect(mode);
        return () => { 
            stopStream();
            closeConnection();
            disconnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        navigate(`/${mode}`)
    }, [mode, navigate])

    useEffect(() => { 
        mode !== "text" && tac && !localStream && startStream()
        mode === "text" && stopStream();
     }, [localStream, mode, startStream, stopStream, tac])

    return (
        <section className="flex flex-col flex-1 w-full gap-4 relative min-h-display"> 
            <div className="flex flex-col md:flex-row gap-4 flex-1">
                {
                    !isTextOnly && 
                    <div className="flex flex-col gap-4 max-h-content md:max-w-1/4 w-full relative">
                        <VideoBox source={remoteStream} />
                        <VideoBox source={localStream} muted={true} className="w-[25%] bg-accent bottom-2 right-2 md:bottom-[auto] md:right-[auto] md:w-full absolute md:relative" />
                    </div>
                }
                <ChatBox className="flex flex-col flex-1 gap-4" messages={messages} status={status} isSimulated={isSimulated}>
                    { 
                        [4,5].includes(status) &&                          
                        <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="flex flex-col gap-2 flex-1 w-full sm:max-w-md">
                                <Toggle onChange={() => dispatch({type: "INTEREST", payload: !interest})} checked={interest}>
                                    { t("chat.interests") }
                                </Toggle>
                                <InterestInput
                                    values={interests} 
                                    onAdd={(i) => dispatch({type: "ADD_INTEREST", payload: i})}
                                    onDelete={(i) => dispatch({type: "DEL_INTEREST", payload: i})}
                                    className="w-full "
                                />
                            </div>
                            <div className="flex flex-col gap-2 items-start">
                                <Toggle onChange={() => dispatch({type: "TOGGLE_AUTO"})} checked={auto}>
                                    {t("chat.reconnect")}
                                </Toggle>
                                <div className="flex flex-row sm:flex-col gap-2">
                                    <button 
                                        onClick={() => {
                                            dispatch({ type: "CONFIRMATION", payload: confirmation + 1 })
                                            startSearch()
                                        }} 
                                        className="btn sm:w-full btn-lg btn-primary "
                                    >
                                        {t("chat.newchat")}
                                    </button>
                                    <div className="divider divider-horizontal uppercase sm:hidden">{ t("common.or") }</div>
                                    <button 
                                        onClick={()=>dispatch({type: "MODE", payload: mode === "text" ? "video" : "text" })} 
                                        className="btn btn-lg text-sm sm:w-full sm:btn-xs sm:text-xs sm:self-end"
                                    >
                                        { t("common.switchto") } { t(`common.${mode === "text" ? "video" : "text"}`)}
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </ChatBox>
            </div>
            <div className="flex gap-4">
                {
                    !isTextOnly &&                        
                    <div className="absolute top-2 left-2 md:top-[auto] md:left-[auto] md:relative min-w-0 md:min-w-1/4 opacity-60 md:opacity-100">
                        <button onClick={reportPeer} className="btn btn-error btn-sm md:btn-md md:btn-block md:h-full"><MdReport className="h-6 w-6"/> <span className="hidden md:inline">{t("chat.report")}</span></button>
                    </div>
                }
                <ChatControls 
                    onClick={(v) => dispatch({ type: "CONFIRMATION", payload: v})} 
                    onStart={startSearch} 
                    onStop={closeConnection} 
                    onSubmit={sendMessage} 
                    confirmation={confirmation} 
                    disabled={isBanned}
                />
            </div>
        </section>
    )
}

export default Chat;
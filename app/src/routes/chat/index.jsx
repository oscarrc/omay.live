import { ChatBox, ChatControls, VideoBox } from "../../components/chat";
import { InterestInput, Loader, Toggle } from "../../components/partials";
import { useCallback, useEffect, useMemo } from "react";

import { Ad } from "../../components/partials";
import { MdReport } from "react-icons/md"
import { STATUS } from "../../constants/chat";
import { requestFullscreen } from "../../lib/fullscreen";
import { useChat } from "../../hooks/useChat";
import useDeviceDetection from "../../hooks/useDeviceDetection";
import useMouseMoving from "../../hooks/useMouseMoving";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Chat = () => { 
    const { 
        state: { tac, mode, status, confirmation, interests, interest, auto, lang }, 
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
        isDisabled,
        isDisconnected,
        peer
    } = useChat();
    const { t } = useTranslation();
    const { isMobile } = useDeviceDetection();

    const isMouseMoving = useMouseMoving();
    const navigate = useNavigate();
    const isTextOnly = useMemo(()=> mode === "text", [mode]);
    const isUnmoderated = useMemo(()=> mode === "unmoderated", [mode]);
    
    const startSearch = useCallback(async () => {
        if(isDisabled || status === STATUS.CONNECTING) return;
        if(!isUnmoderated) await checkNSFW();
        await createOffer();
    }, [checkNSFW, createOffer, isDisabled, isUnmoderated, status])

    const stopSearch = useCallback(async () => {
        await closeConnection();
    }, [closeConnection])

    const onClick = useCallback(async () => {
        isMobile && requestFullscreen();
        dispatch({ type: "CONFIRMATION", payload: confirmation < 3 ? confirmation + 1 : 0})
        
        confirmation === 0 && await startSearch();
        confirmation === 2 && await stopSearch();
    }, [confirmation, dispatch, startSearch, stopSearch])

    useEffect(()=>{
        if(isDisabled) return;
        if(!tac) navigate("/");
        else connect(mode);
        return () => { 
            stopStream();
            closeConnection();
            disconnect();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        mode && navigate(`/${mode}`)
    }, [mode, navigate])

    useEffect(() => { 
        mode !== "text" && tac && !localStream && status !== STATUS.NOCAM && startStream()
        mode === "text" && stopStream();
     }, [localStream, mode, startStream, status, stopStream, tac])
     
    useEffect(() => {
        let timeout;
        if(isDisconnected && auto && !isMobile && !isMouseMoving) timeout = setTimeout(onClick, 1000);

        return () => { clearTimeout(timeout) }
    }, [auto, isDisconnected, isMobile, isMouseMoving, onClick])
    
    useEffect(() => {
        let timeout;

        if (status !== STATUS.COMMON) return

        timeout = setTimeout(async () => {
            status === STATUS.COMMON && await createOffer(true)
        }, 30000)

        return () => { clearTimeout(timeout) }
    }, [status])

    return (
        <section className="flex flex-col flex-1 w-full gap-4 relative min-h-display"> 
            <div className="flex flex-col md:flex-row gap-4 flex-1 max-h-content md:max-h-full">
                {
                    !isTextOnly && 
                    <div className="flex flex-col gap-4 md:max-h-content md:max-w-1/4 w-full relative">
                        <div className="relative">                           
                            <VideoBox source={remoteStream} />
                            { !remoteStream && status.includes("search") && <Loader className="absolute h-full top-0 left-0" /> } 
                            { isUnmoderated && <Ad zoneId={5167966} className="absolute h-full w-full top-0 left-0 sm:rounded-lg overflow-hidden" /> }
                        </div>
                        <VideoBox source={localStream} muted={true} className="w-[25%] bg-accent bottom-2 right-2 aspect-auto md:aspect-4/3 md:bottom-[auto] md:right-[auto] md:w-full absolute md:relative" />
                    </div>
                }
                <ChatBox 
                    className="scroll flex flex-col flex-1 gap-4 max-h-content overflow-y-auto" 
                    messages={messages} 
                    status={status} 
                    simulated={peer.current.simulated} 
                    common={peer.current.interests?.filter( i => interests.has(i)) || []} 
                    lang={peer.current.lang === lang && lang !== "any"}
                >
                    { 
                        (isDisconnected || status === STATUS.STOPPED) &&
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[3fr_1fr] gap-4 lg:max-w-75%">
                            <div className={`order-2 md:order-1 flex ${isMobile && "col-span-2"}`}>
                                <Toggle onChange={() => dispatch({type: "INTEREST", payload: !interest})} checked={interest}>
                                    { t("chat.interests") }
                                </Toggle>
                            </div>                             
                            {
                                !isMobile &&
                                <div className="order-1 md:order-2 flex">
                                            <Toggle onChange={() => dispatch({type: "TOGGLE_AUTO"})} checked={auto}>
                                                {t("chat.reconnect")}
                                            </Toggle>  
                                </div> 
                            }                        
                            <div className="flex flex-col gap-2 order-3">
                                <InterestInput
                                    values={interests} 
                                    onAdd={(i) => dispatch({type: "ADD_INTEREST", payload: i})}
                                    onDelete={(i) => dispatch({type: "DEL_INTEREST", payload: i})}
                                    className="w-full"
                                />
                                { isDisconnected && auto && isMouseMoving && !isMobile &&
                                    <span className="badge badge-primary w-full badge-lg rounded-md">{t("chat.mousemoving")}</span>
                                }  
                            </div> 
                            <div className="flex flex-col gap-2 order-4">
                                <button 
                                    onClick={() => {
                                        onClick()
                                    }} 
                                    className="btn btn-lg w-full btn-primary "
                                >
                                    {t("chat.newchat")}
                                </button>
                                <button 
                                    onClick={()=>dispatch({type: "MODE", payload: mode === "text" ? "video" : "text" })} 
                                    className="btn text-sm btn-xs w-full text-xs self-end h-fit"
                                >
                                    { t("common.switchto") } { t(`common.${mode === "text" ? "video" : "text"}`)}
                                </button>
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
                    onClick={onClick} 
                    onSubmit={sendMessage} 
                    state={confirmation} 
                    disabled={isDisabled || status === STATUS.CONNECTING}
                />
            </div>
            { isUnmoderated && <Ad zoneId={5172336} /> }
        </section>
    )
}

export default Chat;
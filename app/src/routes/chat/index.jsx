import { ChatBox, ChatControls, VideoBox } from "./components";
import { RETRY_DELAY, STATUS } from "../../constants/chat";
import { Resizable, TagInput, Toggle } from "../../components/partials";
import { useCallback, useEffect, useMemo, useRef } from "react";

import { ADS } from "../../constants/ads";
import Ad from "../../components/ad";
import ChatDownload from "./components/ChatDownload";
import { MdReport } from "react-icons/md"
import { requestFullscreen } from "../../lib/fullscreen";
import { useChat } from "../../hooks/useChat";
import { useCookieConsent } from "../../hooks/useCookieConsent";
import { useDevice } from "../../hooks/useDevice";
import useMouseMoving from "../../hooks/useMouseMoving";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Chat = () => { 
    const { 
        state: { tac, mode, status, confirmation, interests, interest, auto, lang, chats }, 
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
    const { isMobile } = useDevice();
    const { cookieConsent: { targeting } } = useCookieConsent();
    
    const isMouseMoving = useMouseMoving();
    const navigate = useNavigate();
    const isTextOnly = useMemo(()=> mode === "text", [mode]);
    const isUnmoderated = useMemo(()=> mode === "unmoderated", [mode]);
    const isAdPlaying = useMemo(() => status === STATUS.ADPLAYING, [status])

    const grid = useRef(null);

    const resizeGrid = (e) => {
        const width = window.innerWidth;
        const pos = e.screenX || e.targetTouches?.[0].screenX || 0;
        const calc = pos > 0 ? 4*pos / width : 1;
        
        grid.current.style.gridTemplateColumns = `${calc}fr ${4 - calc}fr`
    }
    
    const startSearch = useCallback(async () => {
        if(isDisabled || status === STATUS.CONNECTING) return;
        if(!isUnmoderated) await checkNSFW();
        await createOffer();
    }, [createOffer, isDisabled, isUnmoderated, status])

    const stopSearch = useCallback(async () => {
        if(!isUnmoderated) await checkNSFW();
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
        if(!isDisconnected || !auto || isMobile || isMouseMoving || isDisabled) return
        let timeout = setTimeout(onClick, 1000);

        return () => { timeout && clearTimeout(timeout) }
    }, [auto, isDisconnected, isMobile, isMouseMoving, isDisabled, onClick])
    
    useEffect(() => {
        if (status !== STATUS.COMMON) return

        let timeout = setTimeout(async () => {
            status === STATUS.COMMON && await createOffer(true)
        }, RETRY_DELAY)

        return () => { timeout && clearTimeout(timeout) }
    }, [status])

    useEffect(() => { 
        const handleGrid = (e) => { if(window.innerWidth < 768) grid.current.style = "" }
        window.addEventListener("resize", handleGrid)
        return () => window.removeEventListener("resize", handleGrid)
    }, [])
   
    return (
        <>
            <section ref={grid} className={`grid grid-chat gap-4 w-full relative h-display ${isTextOnly && "text-only"}`}>
                {
                    !isTextOnly &&
                    <Resizable className="flex flex-col w-full gap-4 max-h-content min-h-full" resizeFunction={resizeGrid}>
                            <VideoBox 
                                source={remoteStream} 
                                className="relative aspect-4/3" 
                                loading={!remoteStream && status.includes("search")} 
                                withAds={true} 
                                withBrand={true}
                                playAd={ isDisconnected || isAdPlaying }
                                isUnmoderated={isUnmoderated}
                            />
                            <VideoBox 
                                source={localStream}
                                muted={true}
                                className={`${isAdPlaying ? "animate-fade-out" : "animate-fade-in"} md:animate-none w-[25%] bottom-2 right-2 md:aspect-4/3 md:bottom-[auto] md:right-[auto] md:w-auto absolute md:relative`} 
                                loading={!localStream} 
                            />
                    </Resizable>
                }
                <ChatBox 
                    className="scroll flex flex-col flex-1 gap-4 min-h-full overflow-y-auto" 
                    messages={messages} 
                    status={status} 
                    simulated={peer.current.simulated} 
                    unmoderated={isUnmoderated}
                    common={peer.current.interests?.filter( i => interests.has(i)) || []} 
                    lang={peer.current.lang === lang && lang !== "any"}
                    ad={isTextOnly || isUnmoderated }
                >
                    { 
                        (isDisconnected || status === STATUS.STOPPED) &&                        
                        <>
                            { messages.length > 0 && <ChatDownload messages={messages} lang={lang} /> }
                            <div className={`flex flex-col md:flex-row gap-4 w-full max-w-4xl ${isMobile && "md:items-end"}`}>
                                <div className="flex flex-col gap-4 flex-1">
                                    <Toggle onChange={() => dispatch({type: "INTEREST", payload: !interest})} checked={interest}>
                                        { t("chat.interests") }
                                    </Toggle>
                                    <div className="flex flex-col gap-2 order-3">
                                        <TagInput
                                            values={interests} 
                                            onAdd={(i) => dispatch({type: "ADD_INTEREST", payload: i})}
                                            onDelete={(i) => dispatch({type: "DEL_INTEREST", payload: i})}
                                            className="w-full"
                                            placeholder={t("common.addinterests")}
                                        />
                                        { isDisconnected && auto && isMouseMoving && !isMobile &&
                                            <span className="badge badge-primary w-full badge-lg rounded-md">{t("chat.mousemoving")}</span>
                                        }  
                                    </div> 
                                </div>
                                <div className="flex flex-col gap-4">
                                    {
                                        !isMobile &&
                                            <Toggle onChange={() => dispatch({type: "TOGGLE_AUTO"})} checked={auto}>
                                                {t("chat.reconnect")}
                                            </Toggle>  
                                    } 
                                    <div className="flex flex-col gap-2 justify-end">
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
                            </div>
                        </>
                        
                    }
                </ChatBox>                
                {
                    !isTextOnly && 
                        <div className="absolute top-2 left-2 md:top-[auto] md:left-[auto] md:relative min-w-0 md:min-w-1/4 opacity-60 md:opacity-100">
                            <button onClick={reportPeer} className="btn btn-error btn-sm md:btn-md md:btn-block md:h-16"><MdReport className="h-6 w-6"/> <span className="hidden md:inline">{t("chat.report")}</span></button>
                        </div>
                }
                <ChatControls 
                    onClick={onClick} 
                    onSubmit={sendMessage} 
                    state={confirmation} 
                    disabled={isDisabled || status === STATUS.CONNECTING}
                />            
            </section>
            { targeting && <Ad zoneId={ADS.pagePush[isUnmoderated ? "unmoderated" : "moderated"]} keywords={Array.from(interests)} />}
        </>
    )
}

export default Chat;
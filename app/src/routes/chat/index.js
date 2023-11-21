import { ChatBox, ChatControls, VideoBox } from "../../components/chat";
import { useEffect, useMemo } from "react";

import { MdReport } from "react-icons/md"
import { useChat } from "../../hooks/useChat";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useWebcam from "../../hooks/useWebcam";

const Chat = () => {
    const { state: { tac, mode }, createOffer, connect, disconnect, messages, sendMessage, checkNSFW } = useChat();
    const { cam, camError, startCam, getImg } = useWebcam();
    const { t } = useTranslation();

    const navigate = useNavigate();
    const isTextOnly = useMemo(()=> mode === "text", [mode]);

    const onSearch = async () => {
        // const img = getImg();
        // const result = await checkNSFW(img);

        createOffer();
    }

    useEffect(()=>{
        if(!tac) navigate("/");
        else if(!camError) connect(mode, cam);
        return () => { disconnect() }
    }, [cam, camError, connect, disconnect, mode, navigate, tac])

    // useEffect(() => () => { disconnect() }, [disconnect])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { mode !== "text" && tac && startCam() }, [])

    return (
        <section className="flex flex-col flex-1 w-full gap-4 relative min-h-display"> 
            <div className="flex flex-col md:flex-row gap-4 flex-1">
                {
                    !isTextOnly && 
                    <div className="flex flex-col gap-4 max-h-content md:max-w-1/4 w-full relative">
                        <VideoBox />
                        <VideoBox source={cam} muted={true} className="w-[25%] bg-accent bottom-2 right-2 md:bottom-[auto] md:right-[auto] md:w-full absolute md:relative" />
                    </div>
                }
                <ChatBox className="flex-1" messages={messages} />
            </div>
            <div className="flex gap-4">
                {
                    !isTextOnly &&                        
                    <div className="absolute top-2 left-2 md:top-[auto] md:left-[auto] md:relative min-w-0 md:min-w-1/4 opacity-60 md:opacity-100">
                        <button className="btn btn-error btn-sm md:btn-md md:btn-block md:h-full"><MdReport className="h-6 w-6"/> <span className="hidden md:inline">{t("chat.report")}</span></button>
                    </div>
                }
                <ChatControls onClick={onSearch} onSubmit={sendMessage} />
            </div>
        </section>
    )
}

export default Chat;
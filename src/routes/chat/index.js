import { ChatBox, ChatControls, VideoBox } from "../../components/chat";

import { MdReport } from "react-icons/md"
import { useChat } from "../../hooks/useChat";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Chat = ({textOnly}) => {
    const { tacAccepted } = useChat();
    const navigate = useNavigate();

    useEffect(()=>{
        !tacAccepted && navigate("/")
    }, [navigate, tacAccepted])

    return (
        <section className="flex flex-col flex-1 w-full gap-4 relative min-h-display"> 
            <div className="flex flex-col md:flex-row gap-4 flex-1">
                {
                    !textOnly && 
                    <div className="flex flex-col gap-4 max-h-content md:max-w-1/4 w-full relative">
                        <VideoBox />
                        <VideoBox className="w-[25%] bg-accent bottom-2 right-2 md:bottom-[auto] md:right-[auto] md:w-full absolute md:relative" />
                    </div>
                }
                <ChatBox className="flex-1" />
            </div>
            <div className="flex gap-4">
                {
                    !textOnly &&                        
                    <div className="absolute top-2 left-2 md:top-[auto] md:left-[auto] md:relative min-w-0 md:min-w-1/4 opacity-60 md:opacity-100">
                        <button className="btn btn-error btn-sm md:btn-md md:btn-block md:h-full"><MdReport className="h-6 w-6"/> <span className="hidden md:inline">Report</span></button>
                    </div>
                }
                <ChatControls />
            </div>
        </section>
    )
}

export default Chat;
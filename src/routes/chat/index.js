import { ChatBox, VideoBox } from "../../components/chat";

import { MdReport } from "react-icons/md"

const Chat = ({textOnly}) => {
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
                <div className="flex gap-1 w-full h-16">                   
                    <button className="btn h-full flex flex-col gap-1 btn-primary w-24 rounded-none md:rounded-lg md:rounded-r-none">Start <span className="text-base-100 text-xs">Esc</span></button>
                    <textarea className="flex-1 h-full textarea textarea-bordered textaerea-fixed rounded-none shadow-inner"/>
                    <button className="btn h-full flex flex-col gap-1 bg-base-100 w-24 rounded-none md:rounded-lg md:rounded-l-none">Send <span className="text-primary text-xs">Enter</span></button>
                </div>
            </div>
        </section>
    )
}

export default Chat;
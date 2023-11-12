import { ChatBox, VideoBox } from "../../components/chat";

import { MdReport } from "react-icons/md"

const Chat = ({textOnly}) => {
    return (
        <section className="flex flex-col flex-1 w-full gap-4"> 
            <div className="flex gap-4 flex-1">
                {
                    !textOnly && 
                    <div className="flex flex-col gap-4 min-w-1/4">
                        <VideoBox />
                        <VideoBox />
                    </div>
                }
                <ChatBox className="flex-1" />
            </div>
            <div className="flex gap-4">
                {
                    !textOnly &&                        
                    <div className="min-w-1/4">
                        <button className="btn btn-error btn-block h-full"><MdReport className="h-6 w-6"/> Report</button>
                    </div>
                }
                <div className="flex gap-1 w-full h-16">                   
                    <button className="btn h-full flex flex-col gap-1 btn-primary w-24 rounded-r-none">Start <span className="text-base-100 text-xs">Esc</span></button>
                    <textarea className="flex-1 h-full textarea textarea-bordered textaerea-fixed rounded-none shadow-inner"/>
                    <button className="btn h-full flex flex-col gap-1 bg-base-100 w-24 rounded-l-none">Send <span className="text-primary text-xs">Enter</span></button>
                </div>
            </div>
        </section>
    )
}

export default Chat;
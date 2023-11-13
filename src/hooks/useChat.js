import { createContext, useContext } from "react";

const ChatContetx =  createContext(null);

const ChatProvider = ({ children }) => {
    return (
        <ChatContetx.Provider>
            { children }        
        </ChatContetx.Provider>
    )
}

const useChat = () => {
    const context = useContext(ChatContetx);
    if(context === undefined) throw new Error("useChat must be used within a ChatProvider")
    return context;
}

export { ChatProvider, useChat }
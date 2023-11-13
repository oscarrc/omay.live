import { createContext, useContext, useState } from "react";

const ChatContetx =  createContext(null);

const ChatProvider = ({ children }) => {
    const [ textOnly, setTextOnly ] = useState(false);
    const [ withInterest, setWithInterests ] = useState(false);
    const [ interest, setInterests ] = useState([]);
    const [ language, setLanguage ] = useState("");
    const [ messages, setMessages ] = useState("");
    const [ state, setState ] = useState(-1);
    const [ tacAccepted, setTacAccepted ] = useState(false);

    return (
        <ChatContetx.Provider
            value={{
                tacAccepted
            }}
        >
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
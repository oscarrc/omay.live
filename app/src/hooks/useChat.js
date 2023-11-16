import { DEFAULTS, MODES } from "../constants/chat";
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";

import { io } from 'socket.io-client';

const ChatContext =  createContext(null);

const ChatReducer = (state, action) => {
    const { type, payload } = action;
    switch(type){
        case "TAC":
            return { ...state, tac: !!payload}
        case "MODE":
            if(!MODES.includes(payload)) return state;
            return { ...state, mode: payload}
        case "INTEREST":            
            return { ...state, interest: !!payload}   
        case "LANG":            
            return { ...state, lang: payload}
        case "RESET":
            return { ...DEFAULTS, lang: state.lang }
        default:
            break;
    }
}

const ChatProvider = ({ children }) => {     
    const [ interests, setInterests ] = useState([]); 
    const [ messages, setMessages ] = useState([]);
    const [ status, setStatus ] = useState(-1);
    const [ state, dispatch ] = useReducer(ChatReducer, DEFAULTS);
    const socket = useRef(null);
    
    useEffect(() => {
       if(!socket.current) socket.current = io("localhost:8080");
    }, [])

    useEffect(() => {
        const onConnect = () => console.log("connected");
        socket.current.on('connect', onConnect);
        return () => { socket.current.off('connect', onConnect) }
    })

    return (
        <ChatContext.Provider
            value={{
                state,
                dispatch,
                interests,
                setInterests,
            }}
        >
            { children }        
        </ChatContext.Provider>
    )
}

const useChat = () => {
    const context = useContext(ChatContext);
    if(context === undefined) throw new Error("useChat must be used within a ChatProvider")
    return context;
}

export { ChatProvider, useChat }
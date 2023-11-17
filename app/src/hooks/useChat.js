import * as nsfwjs from 'nsfwjs'

import { DEFAULTS, MODES, RTC_SERVERS } from "../constants/chat";
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
    const [ peer, setPeer ] = useState(null);
    const [ state, dispatch ] = useReducer(ChatReducer, DEFAULTS);
    
    const socket = useRef(null);
    const connection = useRef(null);
    const nsfw = useRef(null);
    const stream = useRef({
        remote: null,
        local: null
    })
    
    const connect = (mode) => {
        socket.current.io.opts.query = { mode, interests }
        socket.current.connect("localhost:8080")
    };

    const disconnect = () => socket.current.disconnect();

    const loadNSFW = async () => await nsfwjs.load();

    const checkNSFW = async (img) => {
        if(!nsfw.current) return;
        const predictions = await nsfw.current.classify(img);
        console.log(predictions)
    }

    const createConnection = async () => {        
        connection.current = new RTCPeerConnection(RTC_SERVERS);
        stream.current.remote = new MediaStream();
        
        stream.current.local.getTracks().forEach( t => connection.current.addTrack(t))
        connection.current.ontrack = async (e) => e.streams[0].getTracks().forEach( t => stream.current.remote.addTrack(t))

        stream.current.remote.oninactive = () => {
            stream.current.remote.getTracks().forEach(t => t.enabled = !t.enabled);
            connection.current.close();
        }

        connection.current.onicecandidate = async (e) => {
            if(!e.candidate) return;
            socket.emit("candidatesent", {
                id: socket.current.id,
                remoteId: peer,
                iceCandidate: e.candidate
            })
        }
    }

    const createOffer = async () => {
        await createConnection();

        const offer = await connection.current.createOffer();                
        await connection.current.setLocalDescription(offer);
        
        socket.emit("offercreated", {
            id: socket.current.id,
            remoteId: peer,
            offer
        })
    }

    const onReciveOffer = async (data) => { //Create answer       
        await createConnection();                
        await connection.current.setRemoteDescription(data.offer); 
        
        const answer = await connection.current.createAnswer();
        await connection.current.setLocalDescription(answer);

        socket.emit("answercreated", {
            id: socket.current.id,
            remoteId: data.peer,
            answer,
        })
    }

    const onReceiveAnswer = async (data) => { //Set remote description
        if(this.connection.current.currentRemoteDescription) return;
        this.connection.current.setRemoteDescription(data.answer);
    }

    useEffect(() => {
       if(!socket.current) socket.current = io("localhost:8080", { query:{}, autoConnect: false });
       if(!nsfw.current) nsfw.current = loadNSFW();
    }, []) 

    useEffect(() => {
        const onConnect = () => console.log("connected");
        const onDisconnect = () => console.log("disconnected");

        socket.current.on('connect', onConnect);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('receiveoffer', onReciveOffer);        
        socket.current.on('receiveanswer', onReceiveAnswer)

        return () => { 
            socket.current.off('connect', onConnect);
            socket.current.off('disconnect', onDisconnect);
            socket.current.off('receiveoffer', onReciveOffer);        
            socket.current.off('receiveanswer', onReceiveAnswer)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ChatContext.Provider
            value={{
                checkNSFW,
                connect,
                disconnect,
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
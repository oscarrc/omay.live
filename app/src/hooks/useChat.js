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
    const stream = useRef({ remote: null, local: null });
    const data = useRef(null);
    
    const connect = (mode) => {
        socket.current.io.opts.query = { mode, interests }
        socket.current.connect(process.env.SERVER_URL)
    };

    const disconnect = () => socket.current.disconnect();

    const loadNSFW = async () => {
        try{
            return await nsfwjs.load('indexeddb://model')
        }catch{            
            const load = await nsfwjs.load();
            await load.model.save('indexeddb://model');
            return load;
        }
    }

    const checkNSFW = async (img) => {
        if(!nsfw.current) return;
        const predictions = await nsfw.current.classify(img);
        console.log(predictions)
    }

    const findPeer = async () => {
        const res = await fetch(`${process.env.SERVER_URL}/chat`, {
            method: "POST",
            body: {
                peer: socket.id,
                query: {}
            }
        })

        setPeer(res.peer);
    }

    const createConnection = async (stream) => {        
        connection.current = new RTCPeerConnection(RTC_SERVERS);
        
        if(state.mode !== "text"){
            stream.current.remote = new MediaStream();        
            stream.current.local.getTracks().forEach( t => connection.current.addTrack(t))
            connection.current.ontrack = async (e) => e.streams[0].getTracks().forEach( t => stream.current.remote.addTrack(t))
        }

        stream.current.remote.oninactive = () => {
            state.mode !== "text" && stream.current.remote.getTracks().forEach(t => t.enabled = !t.enabled);
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

        connection.current.ondatachannel = (e) => data.current = e.channel;

        data.current = connection.current.createDataChannel("data");
        data.current.onMessage = (e) => setMessages(m => [...m, { me: false, msg: e.data}]);
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

    const sendMessage = (msg) => {
        data.current.send(msg);
        setMessages(m => [...m, { me: true, msg } ])
    };

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
                messages,
                sendMessage
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
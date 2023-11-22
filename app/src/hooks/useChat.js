import { CAMERA_OPTIONS, DEFAULTS, MODES, RTC_SERVERS, VIRTUAL_CAMS } from "../constants/chat";
import { createContext, useContext, useEffect, useReducer, useRef, useState } from "react";
import { getImage, loadNSFW } from "../components/lib/nsfw";

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
        case "STATUS":
            return { ...state, status: payload }
        default:
            break;
    }
}

const ChatProvider = ({ children }) => {     
    const [ interests, setInterests ] = useState([]); 
    const [ messages, setMessages ] = useState([]);
    const [ localStream, setLocalStream ] = useState(null);
    const [ remoteStream, setRemoteStream ] = useState(null);
    const [ streamError, setStreamError ] = useState(false);
    const [ state, dispatch ] = useReducer(ChatReducer, DEFAULTS);
    
    const socket = useRef(null);
    const connection = useRef(null);
    const nsfw = useRef(null);
    const data = useRef({ send: null, receive: null });
    const peer = useRef(null);
    
    const connect = (mode) => {
        socket.current.io.opts.query = { mode, interests }
        socket.current.connect()
    };

    const disconnect = () => {
        socket.current.disconnect();
        connection.current = null;
    }

    const startStream = async () => {
        setStreamError(false);
        
        try{
            let stream = await navigator.mediaDevices.getUserMedia(CAMERA_OPTIONS);
            setLocalStream(stream);
        }catch(e){
            setStreamError(true);
        }    
    }
    
    const stopStream = async () => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
        setRemoteStream(null);
    }

    const isVirtual = () => {
        const label = localStream.getVideoTracks()[0].label
        return VIRTUAL_CAMS.find( v => new RegExp(v, 'i').test(label))
    }

    const checkNSFW = async () => {
        if(!nsfw || !localStream) return;
        const img = await getImage(localStream);
        const predictions = await nsfw.current.classify(img);
        console.log(predictions)

        return predictions;
    }

    const findPeer = async () => {
        const res = await fetch(`http://localhost:8080/chat`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                peer: socket.current.id,
                query: {}
            })
        }).then( async res => await res.json() )

        return res.peer;
    }

    const createConnection = async () => {      
        peer.current = await findPeer();          
        connection.current = new RTCPeerConnection(RTC_SERVERS);
        
        if(state.mode !== "text"){
            const remote = new MediaStream();            

            remote.oninactive = () => {
                state.mode !== "text" && remoteStream.getTracks().forEach(t => t.enabled = !t.enabled);
                connection.current.close();
            }
            
            localStream.getTracks().forEach( t => connection.current.addTrack(t))
            connection.current.ontrack = async (e) => {
                remote.addTrack(e.track)
                setRemoteStream(remote)
            }
        }

        connection.current.onicecandidate = async (e) => {
            if(!e.candidate) return;

            socket.current.emit("candidatesent", {
                id: socket.current.id,
                remoteId: peer.current,
                iceCandidate: e.candidate
            })
        }

        connection.current.ondatachannel = (e) => {
            data.current.receive = e.channel;
            data.current.receive.onmessage = (e) => setMessages(m => [...m, { me: false, msg: e.data}]) 
        }

        data.current.send = connection.current.createDataChannel("data");
    }

    const createOffer = async () => {
        console.log("offercreated")
        await createConnection();
        
        const offer = await connection.current.createOffer();                
        await connection.current.setLocalDescription(offer);
        
        socket.current.emit("offercreated", {
            id: socket.current.id,
            remoteId: peer.current,
            offer
        })
    }

    const onReciveOffer = async (data) => { //Create answer  
        console.log("answercreated")     
        
        // await createConnection();            
        await connection.current.setRemoteDescription(data.offer); 
        
        const answer = await connection.current.createAnswer();
        await connection.current.setLocalDescription(answer);

        peer.current = data.id;
        
        socket.current.emit("answercreated", {
            id: socket.current.id,
            remoteId: data.id,
            answer,
        })
    }

    const onReceiveAnswer = async (data) => { //Set remote description
        console.log("answerreceived")
        await connection.current.setRemoteDescription(data.answer); 
        
        socket.current.emit("answerreceived", {
            id: socket.current.id,
            remoteid: data.peer
        })
    }

    const onReceiveCandidate = async (data) => {
        console.log("icecandidatereceived")
        await connection.current.addIceCandidate(data.iceCandidate)
    }

    const sendMessage = (msg) => {
        setMessages(m => [...m, { me: true, msg: msg}])
        data.current.send.send(msg);
    }

    useEffect(() => {
       if(!socket.current) socket.current = io("http://localhost:8080", { query:{}, autoConnect: false });
       if(!nsfw.current) nsfw.current = loadNSFW();
    }, []) 

    useEffect(() => {
        const onConnect = () => console.log("connected");
        const onDisconnect = () => console.log("disconnected");

        socket.current.on('connect', onConnect);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('receiveoffer', onReciveOffer);        
        socket.current.on('receiveanswer', onReceiveAnswer);        
        socket.current.on('receivecandidate', onReceiveCandidate);

        return () => { 
            socket.current.off('connect', onConnect);
            socket.current.off('disconnect', onDisconnect);
            socket.current.off('receiveoffer', onReciveOffer);        
            socket.current.off('receiveanswer', onReceiveAnswer);        
            socket.current.off('receivecandidate', onReceiveCandidate);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ChatContext.Provider
            value={{
                connect,
                createOffer,
                disconnect,
                dispatch,
                sendMessage,
                setInterests,               
                startStream,
                stopStream,
                interests,
                localStream, 
                messages,
                remoteStream,
                state,
                streamError
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
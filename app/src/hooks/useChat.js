import { CAMERA_OPTIONS, DEFAULTS, MODES, RTC_SERVERS, VIRTUAL_CAMS } from "../constants/chat";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";
import { getImage, loadNSFW } from "../components/lib/nsfw";

import { LOCALES } from "../constants/locales";
import { io } from 'socket.io-client';
import { useTranslation } from "react-i18next";

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
            return { ...state, interest: payload}        
        case "ADD_INTEREST":  
            state.interests.add(payload)
            return { ...state, interests: new Set(state.interests), interest: state.interests.size === 1 ? true : state.interest}
        case "DEL_INTEREST":          
            state.interests.delete(payload)
            return { ...state, interests: new Set(state.interests), interest: state.interests.size !== 0 }
        case "TOGGLE_AUTO":
            return { ...state, auto: !state.auto }
        case "LANG":          
            let lang = !LOCALES[payload] ? payload.split("-")[0] : payload;
            return { ...state, lang }
        case "RESET":
            return { ...DEFAULTS, ...(state.status === 7 ? {status: 7} : {}), lang: state.lang, interests: state.interests }
        case "STATUS":
            return { ...state, status: state.status === 7 ? 7 : payload }
        case "CONFIRMATION":
            return { ...state, confirmation: payload < 3 && payload > -1 ? payload : 0 }
        default:
            break;
    }
}

const ChatProvider = ({ children }) => {     
    const [ messages, setMessages ] = useState([]);
    const [ localStream, setLocalStream ] = useState(null);
    const [ remoteStream, setRemoteStream ] = useState(null);
    const [ state, dispatch ] = useReducer(ChatReducer, DEFAULTS);
    
    const { i18n } = useTranslation();

    const socket = useRef(null);
    const connection = useRef(null);
    const nsfw = useRef(null);
    const data = useRef({ send: null, receive: null });
    const peer = useRef(null);

    const isSimulated = useMemo(() => {
        if(!localStream) return false;
        const label = localStream.getVideoTracks()[0].label
        return VIRTUAL_CAMS.findIndex( v => new RegExp(v, 'i').test(label)) >= 0
    }, [localStream])

    const isBanned = useMemo(() => state.status === 7, [state.status])
    
    const connect = (mode) => {
        socket.current.io.opts.query = { 
            mode, 
            interests: state.interest ? Array.from(state.interests) : [], 
            lang: state.lang,
            simulated: isSimulated
        }
        
        socket.current.connect()
    };

    const disconnect = () => {
        socket.current.disconnect();
        connection.current = null;
        setMessages([]);
    }

    const startStream = async () => {     
        console.log(1)   
        try{
            let stream = await navigator.mediaDevices.getUserMedia(CAMERA_OPTIONS);
            setLocalStream(stream);
        }catch(e){
            dispatch({type: "STATUS", payload: 6 })
        }    
    }
    
    const stopStream = async () => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
    }

    const reportPeer = () => {
        socket.current.emit("report", { id: peer.current });
        closeConnection();
    }

    const checkNSFW = async () => {
        if(!nsfw || !localStream) return;
        const img = await getImage(localStream);
        const predictions = await nsfw.current.classify(img);
        
        if(predictions[0].className === "Porn" && predictions[0].probability >= 0.25){
            socket.current.emit("report", { id: socket.current.id })
        }
    }

    const findPeer = async () => {
        dispatch({ type: "STATUS", payload: 2 });
        const res = await fetch(`http://localhost:8080/chat`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                peer: socket.current.id,
                mode: state.mode,
                query: {
                    ...(state.lang !== "any" ? { lang: state.lang} : {}),
                    ...(state.interest ? { interests: Array.from(state.interests) } : {})
                }
            })
        }).then( async res => await res.json() )

        return res.peer;
    }

    const createConnection = async () => {      
        peer.current = await findPeer();          
        connection.current = new RTCPeerConnection(RTC_SERVERS);
        setMessages([]);
        
        if(state.mode !== "text"){
            const remote = new MediaStream();
            
            localStream?.getTracks().forEach( t => connection.current.addTrack(t))
            
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

        connection.current.onconnectionstatechange = (e) => {
            connection.current.connectionState === "disconnected" && closeConnection(true)
        }

        data.current.send = connection.current.createDataChannel("data");
    }
    
    const closeConnection = (remote) => {
        !remote && socket.current.emit("connectionclosed", {
            id: socket.current.id,
            remoteId: peer.current
        })

        peer.current = null;
        data.current = { send: null, receive: null };
        remoteStream && remoteStream?.getTracks().forEach(track => track.stop()) && setRemoteStream(null);
        connection.current && connection.current.close();

        setRemoteStream(null);
        dispatch({ type: "STATUS", payload: remote ? 4 : 5 });
        (state.confirmation > 1 || remote) && dispatch({ type: "CONFIRMATION", payload: 0 });
    }

    const createOffer = async () => {
        console.log("offercreated");
        dispatch({ type: "STATUS", payload: 1 });
        
        await closeConnection();
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
        dispatch({ type: "STATUS", payload: 3 });
        console.log("icecandidatereceived")
        await connection.current.addIceCandidate(data.iceCandidate)
    }

    const onPeerDisconnected = async () => {
        console.log('peerdisconnected')
        closeConnection(true);
    }

    const onBanned = () => dispatch({ type: "STATUS", payload: 7 })

    const sendMessage = (msg) => {
        setMessages(m => [...m, { me: true, msg: msg}])
        data.current.send.send(msg);
    }

    useEffect(() => {
       if(!socket.current) socket.current = io("http://localhost:8080", { query:{}, autoConnect: false });
       if(!nsfw.current) loadNSFW().then(l => nsfw.current = l);
    }, []) 

    useEffect(() => dispatch({type:"LANG", payload: i18n.language }), [i18n.language])

    useEffect(() => {
        if(!state.mode) return;

        socket.current.emit('peerupdated', {
            lang: state.lang,
            interests: Array.from(state.interests),
            mode: state.mode,
            simulated: isSimulated
        })
    }, [state.lang, state.interests, state.mode, isSimulated])

    useEffect(() => {
        const onConnect = () => console.log("connected");
        const onDisconnect = () => console.log("disconnected");

        socket.current.on('connect', onConnect);
        socket.current.on('banned', onBanned);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('receiveoffer', onReciveOffer);        
        socket.current.on('receiveanswer', onReceiveAnswer);        
        socket.current.on('receivecandidate', onReceiveCandidate);
        socket.current.on('peerdisconnected', onPeerDisconnected);

        return () => { 
            socket.current.off('connect', onConnect);
            socket.current.off('disconnect', onDisconnect);
            socket.current.off('receiveoffer', onReciveOffer);        
            socket.current.off('receiveanswer', onReceiveAnswer);        
            socket.current.off('receivecandidate', onReceiveCandidate);
            socket.current.off('peerdisconnected', onPeerDisconnected);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <ChatContext.Provider
            value={{
                checkNSFW,
                connect,
                createOffer,
                closeConnection,
                disconnect,
                dispatch,
                sendMessage,
                startStream,
                stopStream,
                reportPeer,
                localStream, 
                messages,
                remoteStream,
                state,
                isBanned,
                isSimulated
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
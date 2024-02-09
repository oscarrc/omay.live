import { CAMERA_OPTIONS, DEFAULTS, MODES, RTC_SERVERS, STATUS, VIRTUAL_CAMS } from "../constants/chat";
import { createContext, useContext, useEffect, useMemo, useReducer, useRef, useState } from "react";

import { LOCALES } from "../constants/locales";
import { getImage } from "../lib/image";
import { io } from 'socket.io-client';
import nsfwWorker from "../workers/nsfw.worker?worker";
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
            state.interests.add(payload);
            localStorage.setItem("interests", JSON.stringify(Array.from(state.interests)));
            return { ...state, interests: new Set(state.interests), interest: state.interests.size > 0 ? true : state.interest}
        case "DEL_INTEREST":          
            state.interests.delete(payload)
            localStorage.setItem("interests", JSON.stringify(Array.from(state.interests)));
            return { ...state, interests: new Set(state.interests), interest: state.interests.size !== 0 }
        case "TOGGLE_AUTO":
            return { ...state, auto: !state.auto }
        case "LANG":          
            let lang = !LOCALES[payload] ? payload.split("-")[0] : payload;
            return { ...state, lang }        
        case "CHAT":          
            return { ...state, chats: state.chats + 1 }
        case "RESET":            
            return { 
                ...DEFAULTS, 
                ...(state.status === STATUS.BANNED ? {status: STATUS.BANNED} : {}), 
                lang: state.lang, 
                auto: state.auto,
                chats: state.chats,
                interest: state.interest
            }
        case "STATUS":            
            if(state.status === STATUS.BANNED) return state;
            if(!Object.values(STATUS).includes(payload)) return state;
            return { ...state, status: payload }
        case "CONFIRMATION":
            if(state.status === 7) return state;
            return { ...state, confirmation: payload < 3 && payload > -1 ? payload : 0 }
        default:
            return state;
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
    const peer = useRef({ id: null, lang: null, interests: [], simulated: false });

    const isSimulated = useMemo(() => {
        if(!localStream) return false;
        const label = localStream.getVideoTracks()[0].label
        return VIRTUAL_CAMS.findIndex( v => new RegExp(v, 'i').test(label)) >= 0
    }, [localStream])

    const isBanned = useMemo(() => state.status === STATUS.BANNED, [state.status])
    const isDisabled = useMemo(() => [STATUS.BANNED, STATUS.NOCAM, STATUS.ERROR, STATUS.ADPLAYING].includes(state.status), [state.status])    
    const isDisconnected = useMemo(() => [STATUS.STRANGERDISCONNECTED, STATUS.YOUDISCONNECTED].includes(state.status), [state.status])

    const connect = (mode) => {
        socket.current.io.opts.query = { 
            mode, 
            interests: Array.from(state.interests),
            common: state.interest,
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
        try{
            let stream = await navigator.mediaDevices.getUserMedia(CAMERA_OPTIONS);
            setLocalStream(stream);
        }catch(e){
            dispatch({type: "STATUS", payload: STATUS.NOCAM })
        }    
    }
    
    const stopStream = async () => {
        localStream?.getTracks().forEach(track => track.stop());
        setLocalStream(null);
    }

    const reportPeer = () => {
        if(!peer.current.id) return;
        socket.current.emit("report", { id: peer.current.id });
        closeConnection();
    }

    const checkNSFW = async () => {
        if(!nsfw || !localStream) return;
        const img = await getImage(localStream);
        nsfw.current.postMessage(img);
    }

    const handleNSFW = async (predictions) => {
        const check = predictions
                .filter( p => p.className === "Porn" || p.className === "Sexy") 
                .reduce((acc, pred) => acc + pred.probability, 0)
        
        if(check >= predictions[0].probability){
            socket.current.emit("report", { id: socket.current.id })
        }
    }

    const findPeer = async (retry) => {
        const query = {
            common: retry ? false : state.interest && state.interests.size > 0,
            lang: retry ? "any" : state.lang,
            interests: Array.from(state.interests)
        }

        const res = await fetch(`${import.meta.env.VITE_SERVER_URL}/chat`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                peer: socket.current.id,
                mode: state.mode,
                query
            })
        }).then( async res => await res.json() )
        
        return res.peer;
    }

    const createConnection = async (retry) => {         
        if(retry) dispatch({ type: "STATUS", payload: STATUS.RETRY }); 
        else dispatch({ type: "STATUS", payload: state.interest ? STATUS.COMMON : STATUS.RANDOM });    
        
        peer.current = await findPeer(retry)
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
                remoteId: peer.current.id,
                iceCandidate: e.candidate
            })
        }

        connection.current.ondatachannel = (e) => {
            data.current.receive = e.channel;
            data.current.receive.onmessage = (e) => setMessages(m => [...m, { me: false, msg: e.data}]) 
        }

        connection.current.onconnectionstatechange = (e) => {
            const state = connection.current.connectionState;
            switch(state){
                case "connected":                    
                    onPeerConnected()    
                    break;
                case "disconnected":
                case "failed":
                    onPeerDisconnected(true)
                    break;
                default:
                    break;
            }
        }

        data.current.send = connection.current.createDataChannel("data");
    }
    
    const closeConnection = (remote) => {        
        if(!connection.current) return;
        
        dispatch({ type: "STATUS", payload: remote ? STATUS.STRANGERDISCONNECTED : STATUS.YOUDISCONNECTED });
        
        !remote && socket.current.emit("connectionclosed", {
            id: socket.current.id,
            remoteId: peer.current.id
        })

        peer.current = { id: null, lang: null, interests: [], simulated: false };
        data.current = { send: null, receive: null };
        remoteStream && remoteStream?.getTracks().forEach(track => track.stop()) && setRemoteStream(null);
        connection.current && connection.current.close();

        setRemoteStream(null);
        (state.confirmation > 1 || remote) && dispatch({ type: "CONFIRMATION", payload: 0 });
    }

    const createOffer = async (retry) => {        
        await closeConnection();
        await createConnection(retry);
        
        const offer = await connection.current.createOffer();                
        await connection.current.setLocalDescription(offer);
                
        console.log("offercreated");
        socket.current.emit("offercreated", {
            id: socket.current.id,
            remoteId: peer.current.id,
            lang: state.lang,
            interests: Array.from(state.interests),
            simulated: isSimulated,
            offer
        })
    }

    const onReciveOffer = async (data) => { //Create answer           
        await connection.current.setRemoteDescription(data.offer); 
        
        const answer = await connection.current.createAnswer();
        await connection.current.setLocalDescription(answer);

        peer.current = { id: data.id, lang: data.lang, interests: data.interests, simulated: data.simulated };
          
        console.log("answercreated");
        socket.current.emit("answercreated", {
            id: socket.current.id,
            remoteId: data.id,
            answer,
        })
    }

    const onReceiveAnswer = async (data) => { //Set remote description
        await connection.current.setRemoteDescription(data.answer); 
        
        console.log("answerreceived");
        socket.current.emit("answerreceived", {
            id: socket.current.id,
            remoteid: data.id
        })
    }

    const onReceiveCandidate = async (data) => {
        console.log("icecandidatereceived")
        await connection.current.addIceCandidate(data.iceCandidate)
    }

    const onPeerConnected = async () => {
        console.log('peerconnected')
        dispatch({ type: "STATUS", payload: STATUS.CONNECTED });        
        dispatch({ type: "CHAT"});
    }

    const onPeerDisconnected = async () => {
        console.log('peerdisconnected')
        closeConnection(true);
    }

    const onBanned = () => {
        console.log("banned")
        dispatch({ type: "STATUS", payload: STATUS.BANNED });
        dispatch({ type: "CONFIRMATION", payload: 0 });
        closeConnection();
    }
    
    const onConnect = () => {
        console.log("connected");
        dispatch({ type: "STATUS", payload: STATUS.STOPPED });
    };

    const onError = () => {
        console.log("error");
        dispatch({ type: "STATUS", payload: STATUS.ERROR });
        dispatch({ type: "CONFIRMATION", payload: 0 });
    }

    const onDisconnect = () => console.log("disconnected");

    const sendMessage = (msg) => {
        if(state.status !== STATUS.CONNECTED) return;
        setMessages(m => [...m, { me: true, msg: msg}])
        data.current.send.send(msg);
    }

    useEffect(() => {
        if(!socket.current) socket.current = io(import.meta.env.VITE_SERVER_URL, { query:{}, autoConnect: false });
        if(!nsfw.current){ 
            nsfw.current = new nsfwWorker();
            nsfw.current.postMessage("init");
            nsfw.current.addEventListener("message", handleNSFW)
        }

        return () => { nsfw.current.terminate() }
    }, []) 

    useEffect(() => dispatch({type:"LANG", payload: i18n.language }), [i18n.language])

    useEffect(() => {
        if(!state.mode) return;

        socket.current.emit('peerupdated', {
            lang: state.lang,
            common: state.interest,
            interests: Array.from(state.interests),
            mode: state.mode,
            simulated: isSimulated
        })
    }, [state.lang, state.interests, state.mode, isSimulated, state.interest])

    useEffect(() => {        
        socket.current.on('banned', onBanned);
        socket.current.on('connect', onConnect);
        socket.current.on('connect_error', onError);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('receiveoffer', onReciveOffer);        
        socket.current.on('receiveanswer', onReceiveAnswer);        
        socket.current.on('receivecandidate', onReceiveCandidate);
        socket.current.on('peerdisconnected', onPeerDisconnected);

        return () => { 
            socket.current.off('banned', onBanned);
            socket.current.off('connect', onConnect);
            socket.current.off('connect_error', onError);
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
                peer,
                localStream, 
                messages,
                remoteStream,
                state,
                isBanned,
                isSimulated,
                isDisabled,
                isDisconnected
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
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
            if(state.status === 7) return state;
            return { ...state, status: payload }
        case "CONFIRMATION":
            if(state.status === 7) return state;
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
    const [ count, setCount ] = useState(0);

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

    const isBanned = useMemo(() => state.status === 7, [state.status])
    const isDisabled = useMemo(() => [0,6,7].includes(state.status), [state.status])

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
        if(!peer.current.id) return;
        socket.current.emit("report", { id: peer.current.id });
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
        const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/chat`, {
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
                remoteId: peer.current.id,
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
        if(!connection.current) return;
        
        !remote && socket.current.emit("connectionclosed", {
            id: socket.current.id,
            remoteId: peer.current.id
        })

        peer.current = { id: null, lang: null, interests: [], simulated: false };
        data.current = { send: null, receive: null };
        remoteStream && remoteStream?.getTracks().forEach(track => track.stop()) && setRemoteStream(null);
        connection.current && connection.current.close();

        setRemoteStream(null);
        dispatch({ type: "STATUS", payload: remote ? 4 : 5 });
        (state.confirmation > 1 || remote) && dispatch({ type: "CONFIRMATION", payload: 0 });
    }

    const createOffer = async () => {
        dispatch({ type: "STATUS", payload: 2 });
        
        await closeConnection();
        await createConnection();
        
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
        // await createConnection();            
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
        dispatch({ type: "STATUS", payload: 3 });
        await connection.current.addIceCandidate(data.iceCandidate)
    }

    const onPeerDisconnected = async () => {
        console.log('peerdisconnected')
        closeConnection(true);
    }

    const onBanned = () => {
        console.log("banned")
        dispatch({ type: "STATUS", payload: 7 });
        dispatch({ type: "CONFIRMATION", payload: 0 });
        closeConnection();
    }
    
    const onConnect = () => {
        console.log("connected");
        dispatch({ type: "STATUS", payload: 1 });
    };
    const onDisconnect = () => console.log("disconnected");

    const sendMessage = (msg) => {
        setMessages(m => [...m, { me: true, msg: msg}])
        data.current.send.send(msg);
    }

    useEffect(() => {
       if(!socket.current) socket.current = io(process.env.REACT_APP_SERVER_URL, { query:{}, autoConnect: false });
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
        socket.current.on('banned', onBanned);
        socket.current.on('connect', onConnect);
        socket.current.on('disconnect', onDisconnect);
        socket.current.on('receiveoffer', onReciveOffer);        
        socket.current.on('receiveanswer', onReceiveAnswer);        
        socket.current.on('receivecandidate', onReceiveCandidate);
        socket.current.on('peerdisconnected', onPeerDisconnected);

        return () => { 
            socket.current.off('banned', onBanned);
            socket.current.off('connect', onConnect);
            socket.current.off('disconnect', onDisconnect);
            socket.current.off('receiveoffer', onReciveOffer);        
            socket.current.off('receiveanswer', onReceiveAnswer);        
            socket.current.off('receivecandidate', onReceiveCandidate);
            socket.current.off('peerdisconnected', onPeerDisconnected);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_SERVER_URL}/chat`, {
            method: "GET"
        }).then( async (res) => {
            let json = await res.json()
            setCount(json.count)
        });
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
                count,
                peer,
                localStream, 
                messages,
                remoteStream,
                state,
                isBanned,
                isSimulated,
                isDisabled
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
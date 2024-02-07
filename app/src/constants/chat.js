const MODES = ["text","video","unmoderated"]

const RTC_SERVERS = {
    iceServers: [{
        urls: [
            "stun:stun1.1.google.com:19302",
            "stun:stun2.1.google.com:19302",
            "stun:stun3.1.google.com:19302",
            "stun:stun4.1.google.com:19302",
            "stun:freestun.net:3479",
            "stun:freestun.net:5350"
        ]
    }]
}

const  CAMERA_OPTIONS = {
    video: {
        facingMode: 'user'
    },
    audio: true
}

const VIRTUAL_CAMS = [
    "OBS Virtual Cam",
    "ManyCam Virtual Webcam",
    "XSplit VCam",
    "Snap Camera",
    "SplitCam Video Driver",
    "AlterCam Virtual Webcam",
    "vMix Video",
    "CamTwist",
    "Virtual"
]

const STATUS = {
    CONNECTING: "connecting",
    CONNECTED: "connected",
    STOPPED: "stopped",
    RANDOM: "search.random",
    COMMON: "search.common",
    RETRY: "search.retry",
    STRANGERDISCONNECTED: "strangerdisconnected",
    YOUDISCONNECTED: "youdisconnected",
    BANNED: "banned",
    NOCAM: "nocam",
    ERROR: "error",
    ADPLAYING: "adplaying"
}

const DEFAULTS = {
    tac: false,
    mode: undefined,
    interest: (JSON.parse(localStorage.getItem("interests")) || []).length > 0,
    interests: new Set(JSON.parse(localStorage.getItem("interests")) || []),
    lang: "any",
    status: STATUS.CONNECTING,
    auto: true,
    confirmation: 0,
    chats: 0
}

export { MODES, DEFAULTS, RTC_SERVERS, CAMERA_OPTIONS, VIRTUAL_CAMS, STATUS }
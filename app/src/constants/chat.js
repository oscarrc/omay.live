const MODES = ["text","video","unmoderated"]

const DEFAULTS = {
    tac: false,
    mode: undefined,
    interest: false,
    interests: new Set(),
    lang: "any",
    status: 0,
    auto: true,
    confirmation: 0
}

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
    "Virtual",
    "HP Truevision HD"
]

const STATUS = [
    "connecting",
    "stopped",
    "searching",
    "connected",    
    "strangerdisconnected",
    "youdisconnected",
    "nocam",
    "banned"
]

export { MODES, DEFAULTS, RTC_SERVERS, CAMERA_OPTIONS, VIRTUAL_CAMS, STATUS }
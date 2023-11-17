const MODES = ["text","video","unmoderated"]

const DEFAULTS = {
    tac: false,
    mode: undefined,
    interest: false,
    lang: "en"
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

export { MODES, DEFAULTS, RTC_SERVERS, CAMERA_OPTIONS }
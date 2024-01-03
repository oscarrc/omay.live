const requestFullscreen = () => {
    let doc = document.documentElement;
    if(!document.fullscreenEnabled) return;

    if (doc.requestFullscreen) doc.requestFullscreen();
    else if (doc.webkitRequestFullscreen) doc.webkitRequestFullscreen();
    else if (doc.msRequestFullscreen) doc.msRequestFullscreen();
}

export { requestFullscreen }
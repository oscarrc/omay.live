const getImage = (stream) => new Promise( (resolve, reject) => {
    const { width, height } = stream.getVideoTracks()[0].getSettings();
    const canvas = document.createElement("canvas"); 
    canvas.width = width;
    canvas.height = height;

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;

    try{
        video.onloadeddata = () => {
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, width, height); 
            video.muted = true;
            resolve(canvas)
        }
    }catch(e){
        reject(e)
    }
})

export { getImage }
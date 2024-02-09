const getImageData = (stream) => new Promise( (resolve, reject) => {
    const { width, height } = stream.getVideoTracks()[0].getSettings();
    const canvas = document.createElement("canvas"); 
    canvas.width = width;
    canvas.height = height;

    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;

    try{
        video.onloadeddata = async () => {
            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, width, height); 
            video.muted = true;
            
            resolve(context.getImageData(0, 0, width, height).data)
        }
    }catch(e){
        reject(e)
    }
})

export { getImageData }
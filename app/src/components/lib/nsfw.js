import * as nsfwjs from 'nsfwjs'

const loadNSFW = async () => {
    try{
        let nsfw = await nsfwjs.load('indexeddb://model')
        return nsfw;
    }catch{            
        const load = await nsfwjs.load();
        await load.model.save('indexeddb://model');
        return load;
    }
}


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
            console.log(canvas.toDataURL("image/jpeg"))   
            resolve(canvas)
        }
    }catch(e){
        reject(e)
    }
})

export { loadNSFW, getImage }
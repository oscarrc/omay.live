import '@tensorflow/tfjs-backend-wasm';

import * as tf from '@tensorflow/tfjs';

import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';

setWasmPaths(`${import.meta.env.VITE_SERVER_URL}/tf/backend/`);
tf.enableProdMode()

let model;
const SIZE = 224;
const NSFW_CLASSES = {
    0: 'Drawing',
    1: 'Hentai',
    2: 'Neutral',
    3: 'Porn',
    4: 'Sexy'
}

const nsfwProcess = (values) => {
    const topK = 5;
    const result = {}
    const valuesAndIndices = [];
    const topkValues = new Float32Array(topK);
    const topkIndices = new Int32Array(topK);

    for (let i = 0; i < values.length; i++) {
        valuesAndIndices.push({ value: values[i], index: i });
    }

    valuesAndIndices.sort((a, b) => b.value - a.value);
    for (let i = 0; i < topK; i++) {
        topkValues[i] = valuesAndIndices[i].value;
        topkIndices[i] = valuesAndIndices[i].index;
    }

    for (let i=0;i<5;i++) {
        result[NSFW_CLASSES[[topkIndices[i]]]] = Number.parseFloat((topkValues[i] * 100).toFixed(2))
    }
    return result;
}

const detectNSFW = async (bitmap) => {
    const {width: w, height: h} = bitmap;
    const offScreen = new OffscreenCanvas(w,h);
    const ctx = offScreen.getContext('2d');
    ctx.drawImage(bitmap, 0, 0, w, h);

    const canvasData = ctx.getImageData(0, 0, w,h).data;
    const img = new ImageData(canvasData, w, h);
    const pixels = tf.browser.fromPixels(img);
    const normalized = pixels.toFloat().div(tf.scalar(255));

    let resized = normalized;
    if (pixels.shape[0] !== SIZE || pixels.shape[1] !== SIZE) {
        resized = tf.image.resizeBilinear(normalized, [SIZE, SIZE], true);
    }

    const batched = resized.reshape([1, SIZE, SIZE, 3]);
    const predictions = await model.predict(batched);
    const values = await predictions.data();
    const result = nsfwProcess(values);
    predictions.dispose();
    console.log(result);
    self.postMessage(result);
}

const init = async ({data}) => {
    if (typeof data === 'string' && data === 'init') {
        await tf.setBackend('wasm');
        try {
            model = await tf.loadGraphModel('indexeddb://model');
        } catch(e) {
            model = await tf.loadGraphModel(`${import.meta.env.VITE_SERVER_URL}/tf/model/model.json`);
            model.save('indexeddb://model');
        } finally {
            const result = tf.tidy(() => model.predict(tf.zeros([1, SIZE, SIZE, 3])));
            await result.data();
            result.dispose();
        }
        return
    }
    
    const bitmap = await createImageBitmap(data);
    detectNSFW(bitmap);
}

addEventListener('message', init)
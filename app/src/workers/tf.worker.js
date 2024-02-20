import '@tensorflow/tfjs-backend-wasm';

import * as tf from '@tensorflow/tfjs';

import {setWasmPaths} from '@tensorflow/tfjs-backend-wasm';

setWasmPaths(`${import.meta.env.VITE_SERVER_URL}/tf/backend/`);
tf.enableProdMode()

const MODELS = ["nsfw", "gender"]
const SIZE = 224;
const CLASSES = {
    nsfw: {
        0: 'Drawing',
        1: 'Hentai',
        2: 'Neutral',
        3: 'Porn',
        4: 'Sexy'
    }
}

let models = {};
let ready = false;

const process = (values, model) => {
    const topK = 5;
    const result = []
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
        result.push({ className: CLASSES[model][topkIndices[i]], probability: Number.parseFloat((topkValues[i] * 100).toFixed(2)) })
    }
    return result;
}

const detect = async ({img, model}) => {
    const pixels = tf.browser.fromPixels(img);
    const normalized = pixels.toFloat().div(tf.scalar(255));

    let resized = normalized;
    if (pixels.shape[0] !== SIZE || pixels.shape[1] !== SIZE) {
        resized = tf.image.resizeBilinear(normalized, [SIZE, SIZE], true);
    }

    const batched = resized.reshape([1, SIZE, SIZE, 3]);
    const predictions = await models[model].predict(batched);
    const values = await predictions.data();
    const result = process(values, model);
    predictions.dispose();
    self.postMessage(result);
}

const init = async () => {
    await tf.setBackend('wasm');

    await Promise.all(MODELS.map( async (m) => {
        try {                
            models[m] = await tf.loadGraphModel(`indexeddb://${m}`);
        } catch(e) {
            models[m] = await tf.loadGraphModel(`${import.meta.env.VITE_SERVER_URL}/tf/${m}/model.json`);
            models[m].save(`indexeddb://${m}`);
        } finally {
            const result = tf.tidy(() => models[m].predict(tf.zeros([1, SIZE, SIZE, 3])));
            await result.data();
            result.dispose();
        }
    }))

    ready = true;
    return;
}

const handler = async ({data}) => {
    if( data === "init") await init();
    if( !MODELS.includes(data.model) ) return;
    ready && detect(data);
}

addEventListener('message', handler)
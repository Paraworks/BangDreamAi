import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';

window.PIXI = PIXI;
let sessionId = window.sessionId;
let taskId = window.taskID
let configPath = `/api/editor/${sessionId}/${taskId}`;
let playQueue = [];
let audioCtx, analyser;
let preloadedAudios = {};
const modelPaths = {};
const live2DModels = {};

export async function init() {

    // 获取配置并启动应用
    startButton.addEventListener('click', async () => {
        const app = new PIXI.Application({
            view: document.getElementById('canvas_view'),
            transparent: true,
            autoDensity: true,
            autoResize: true,
            antialias: true,
            height: '1080',
            width: '1800',
        });
        audioCtx = new AudioContext();
        analyser = audioCtx.createAnalyser();
        await fetchConfig();
        await startApp(app);
        startButton.style.display = 'none';
    });
}

// 获取配置信息并预加载音频
async function fetchConfig() {
    try {
        const response = await fetch(configPath);
        if (response.ok) {
            const data = await response.json();
            playQueue = data.contents;
            await preloadAudios(playQueue);
        } else {
            throw new Error('Server responded with an error');
        }
    } catch (error) {
        console.error('Failed to fetch configuration:', error);
    }
}

// 预加载所有音频
async function preloadAudios(playQueue) {
    for (const sentenceId in playQueue) {
        const sentenceData = playQueue[sentenceId];
        let audioUrl = `${sentenceData.audiobaseUrl}/${sessionId}/${sentenceData.audioname}`;
        if (audioUrl) {
            preloadedAudios[sentenceId] = await fetchAudio(audioCtx, audioUrl);
        }
    }
}

// 获取音频数据
async function fetchAudio(audioCtx, audioUrl) {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
}

//删除模型
function removelive2d(app, playerID) {
    const model = live2DModels[playerID];
    if (model) {
        app.stage.removeChild(model); // 从舞台上移除模型
        delete live2DModels[playerID]; // 从字典中删除记录
    }
}

// 使模型可拖动
function draggable(model) {
    model.buttonMode = true;
    model.on("pointerdown", (e) => {
        model.dragging = true;
        model._pointerX = e.data.global.x - model.x;
        model._pointerY = e.data.global.y - model.y;
    });
    model.on("pointermove", (e) => {
        if (model.dragging) {
            model.position.x = e.data.global.x - model._pointerX;
            model.position.y = e.data.global.y - model._pointerY;
        }
    });
    model.on("pointerupoutside", () => (model.dragging = false));
    model.on("pointerup", () => (model.dragging = false));
}

// 启动应用程序
async function startApp(app) {
    for (const sentenceId in playQueue) {
        const tempModel = await Live2DModel.from(playQueue[sentenceId].modelPath);
        if (modelPaths[String(playQueue[sentenceId].playerID)] && modelPaths[String(playQueue[sentenceId].playerID)] != playQueue[sentenceId].modelPath){
            removelive2d(app, String(playQueue[sentenceId].playerID));
            setupModel(tempModel, playQueue[sentenceId]);
            app.stage.addChild(tempModel);
            live2DModels[String(playQueue[sentenceId].playerID)] = tempModel;
            modelPaths[String(playQueue[sentenceId].playerID)] = playQueue[sentenceId].modelPath;
            await playSentence(tempModel, playQueue[sentenceId], sentenceId);
        }
        else if (!modelPaths[String(String(playQueue[sentenceId].playerID))]){
            setupModel(tempModel, playQueue[sentenceId]);
            app.stage.addChild(tempModel);
            live2DModels[String(playQueue[sentenceId].playerID)] = tempModel;
            modelPaths[String(playQueue[sentenceId].playerID)] = playQueue[sentenceId].modelPath;
            await playSentence(tempModel, playQueue[sentenceId], sentenceId);
        }
        else{
            await playSentence(live2DModels[String(playQueue[sentenceId].playerID)], playQueue[sentenceId], sentenceId);
        }
    }
}

// 播放单个句子
async function playSentence(model, sentenceData, sentenceId) {
    if (preloadedAudios[sentenceId]) {
        await playPreloadedAudio(audioCtx, analyser, model, preloadedAudios[sentenceId], sentenceData);
    }
}

// 播放预加载的音频
async function playPreloadedAudio(audioCtx, analyser, model, audioBuffer, sentenceData) {
    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.connect(analyser);
    source.start(0);

    model.motion(sentenceData.text.motion, undefined, "IDLE");

    // 同步模型嘴型和音频
    syncModelMouth(model, analyser, sentenceData);

    return new Promise((resolve) => {
        source.onended = () => {
            resolve();
        };
    });
}

// 设置模型参数
function setupModel(model, sentenceData) {
    model.scale.set(sentenceData.scale);
    model.position.set(sentenceData.positionX, sentenceData.positionY);
    model.on('pointerdown', () => model.motion("idle"));
    draggable(model);
}


// 同步模型嘴型与音频
function syncModelMouth(model, analyser) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const setMouthOpenY = (v) => {
        v = Math.max(0, Math.min(1, v));
        model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', v);
    };

    const updateMouth = () => {
        analyser.getByteFrequencyData(frequencyData);
        let sum = frequencyData.reduce((acc, val) => acc + val, 0);
        let average = sum / frequencyData.length;
        setMouthOpenY(average / 255);
        requestAnimationFrame(updateMouth);
    };

    updateMouth();
}

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
        const sentenceData = playQueue[sentenceId];
        let model;

        if (modelPaths[sentenceData.playerID] !== sentenceData.modelPath) {
            if (live2DModels[sentenceData.playerID]) {
                removelive2d(app, sentenceData.playerID);
            }
            model = await Live2DModel.from(sentenceData.modelPath);
            setupModel(model, sentenceData);
            app.stage.addChild(model);
            live2DModels[sentenceData.playerID] = model;
            modelPaths[sentenceData.playerID] = sentenceData.modelPath;
        } else {
            model = live2DModels[sentenceData.playerID];
        }

        // 播放句子并等待完成
        await playSentence(model, sentenceData, sentenceId);
    }
}

// 播放单个句子
function playSentence(model, sentenceData, sentenceId) {
    return new Promise(async (resolve) => {
        if (preloadedAudios[sentenceId]) {
            await playPreloadedAudio(audioCtx, analyser, model, preloadedAudios[sentenceId], sentenceData);
        }
        resolve();
    });
}

// 播放预加载的音频
function playPreloadedAudio(audioCtx, analyser, model, audioBuffer, sentenceData) {
    return new Promise((resolve) => {
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioCtx.destination);
        source.connect(analyser);
        source.start(0);

        model.motion(sentenceData.text.motion, undefined, "IDLE");

        // 启动针对该模型的嘴型同步
        startSyncModelMouth(model, analyser, sentenceData);

        source.onended = () => {
            // 停止嘴型同步
            stopSyncModelMouth(model);
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


// 启动模型嘴型同步
function startSyncModelMouth(model, analyser, sentenceData) {
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const setMouthOpenY = (v) => {
        v = Math.max(0, Math.min(1, v));
        model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', v);
    };

    const o = 100; // 响度上限
    const arrayAdd = (a) => a.reduce((i, a) => i + a, 0);

    model.syncMouth = () => {
        analyser.getByteFrequencyData(frequencyData);
        const arr = [];
        for (let i = 0; i < sentenceData.volum; i += o) {
            arr.push(frequencyData[i]);
        }
        setMouthOpenY((arrayAdd(arr) / arr.length - sentenceData.volum /* 响度下限 */) / 60);
    };

    model.syncMouthInterval = setInterval(model.syncMouth, sentenceData.frequence); // 根据频率更新
}

// 停止模型嘴型同步
function stopSyncModelMouth(model) {
    if (model.syncMouthInterval) {
        clearInterval(model.syncMouthInterval);
        model.syncMouthInterval = null;
    }
}
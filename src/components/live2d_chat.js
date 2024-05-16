import * as PIXI from 'pixi.js';
import { Live2DModel, MotionPreloadStrategy, InternalModel } from 'pixi-live2d-display';

window.PIXI = PIXI;
let audioCtx, analyser;
let model;
let config = {};
let localTextStatus = 'init';
let responseText = '';
let sessionId = window.sessionId;
let configpath = `/api/content/${sessionId}/init/1`;

export async function init() {
    const request = new XMLHttpRequest();
    request.open('GET', configpath, true);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            config = JSON.parse(this.response);
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
                await startApp(app);
                startButton.style.display = 'none';

                // 定时检查配置文件的变化
                setInterval(async () => {
                    const newConfig = await fetchConfig();
                    if (JSON.stringify(newConfig) !== JSON.stringify(config)) {
                        config = newConfig;
                        if (config.text.response !== responseText) {
                            localTextStatus = 'pending';
                            responseText = config.text.response;
                        }
                        await updateApp(app);
                    }
                }, 1000);
            });
        } else {
            console.error('Server reached, but it returned an error');
        }
    };
    request.onerror = function () {
        console.error('Failed to reach server');
    };
    request.send();
}

// 从后端读取配置文件
async function fetchConfig() {
    try {
        const response = await fetch(configpath);
        if (response.ok) {
            return await response.json();
        } else {
            throw new Error('Failed to load config');
        }
    } catch (error) {
        console.error('Failed to fetch configuration:', error);
    }
}

// 获取音频数据
async function fetchAudio(audioCtx, audioUrl) {
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();
    return await audioCtx.decodeAudioData(arrayBuffer);
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
    await updateApp(app);
}

// 更新应用程序
async function updateApp(app) {
    if (model && model.modelPath !== config.modelPath) {
        app.stage.removeChild(model);
        model.destroy();
        model = null;
    }
    if (!model) {
        model = await Live2DModel.from(config.modelPath);
        model.modelPath = config.modelPath;
        setupModel(model, config);
        app.stage.addChild(model);
    }

    model.trackedPointers = [
        { id: 1, type: 'pointerdown', flags: true },
        { id: 2, type: 'mousemove', flags: true }
    ];

    if (localTextStatus === 'pending') {
        const audioUrl = `${config.ttsApiBaseUrl}&speaker=${config.speaker}&text=${encodeURIComponent(config.text.response)}`;
        const audioBuffer = await fetchAudio(audioCtx, audioUrl);
        localTextStatus = 'reading';
        await playPreloadedAudio(audioCtx, analyser, model, audioBuffer, config);
    }
}

// 播放预加载的音频
async function playPreloadedAudio(audioCtx, analyser, model, audioBuffer, sentenceData) {
    if (localTextStatus !== 'reading') return;

    const source = audioCtx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioCtx.destination);
    source.connect(analyser);
    source.start(0);

    model.motion(sentenceData.text.motion, undefined, "IDLE");

    startSyncModelMouth(model, analyser, sentenceData);

    await new Promise((resolve) => {
        source.onended = async () => {
            stopSyncModelMouth(model);
            localTextStatus = 'finished';
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
    if (localTextStatus !== 'reading') return;

    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    const setMouthOpenY = (v) => {
        v = Math.max(0, Math.min(1, v));
        model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', v);
    };

    const o = 100;
    const arrayAdd = (a) => a.reduce((i, a) => i + a, 0);

    model.syncMouth = () => {
        analyser.getByteFrequencyData(frequencyData);
        const arr = [];
        for (let i = 0; i < sentenceData.volum; i += o) {
            arr.push(frequencyData[i]);
        }
        setMouthOpenY((arrayAdd(arr) / arr.length - sentenceData.volum) / 60);
    };

    model.syncMouthInterval = setInterval(model.syncMouth, sentenceData.frequence);
}

// 停止模型嘴型同步
function stopSyncModelMouth(model) {
    if (model.syncMouthInterval) {
        clearInterval(model.syncMouthInterval);
        model.syncMouthInterval = null;
    }
}

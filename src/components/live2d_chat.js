import * as PIXI from 'pixi.js';
import {
    Live2DModel,
    MotionPreloadStrategy,
    InternalModel,
} from 'pixi-live2d-display';

window.PIXI = PIXI;
let sessionId = window.sessionId;
let speaker = window.speaker;
let previousText = ''; 
let config  = {};
let configpath = {};
const modelPaths = {};
const live2DModels = {};
const playingStatus = {};

export async function init() {
    const request = new XMLHttpRequest();
    configpath = `/api/content/${sessionId}/init/1`;
    request.open('GET', configpath, true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // 成功获取响应
            config = JSON.parse(this.response);
            startButton.addEventListener('click', async () => {
                // 点击按钮开始应用程序，否则浏览器会拒绝加载
                const app = new PIXI.Application({
                    view: document.getElementById('canvas_view'),
                    transparent: true,
                    autoDensity: true,
                    autoResize: true,
                    antialias: true,
                    height: '1080',
                    width: '1800',
                });
                await createlive2d(app,config.playerID);
        
                // 你也可以将startButton.addEventListener方法整体注释掉用以直播(obs链接桌面声音)，取消第14行的注释
                startButton.style.display = 'none';
            });
        } else {
            console.error('Server reached, but it returned an error');
        }
    };

    request.onerror = function() {
        console.error('Failed to reach server');
    };

    request.send();
}

//刷新配置
function refreshConfig(app) {
    setInterval(() => {
        const request = new XMLHttpRequest();
        request.open('GET', configpath, true);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                config = JSON.parse(this.response);
                const playerID = String(config.playerID); 
                if (modelPaths[playerID] !== config.modelPath) {
                    playingStatus[playerID] = false;
                    removelive2d(app,playerID);
                    createlive2d(app, playerID); // 创建新的 live2D 模型
                }
            } else {
                console.error('Server reached, but it returned an error');
            }
        };

        request.onerror = function() {
            console.error('Failed to reach server');
        };

        request.send();
    }, 3000); // 每3秒刷新一次配置
}
async function createlive2d(app,playerID) {
    const model = await Live2DModel.from(config.modelPath, {
        motionPreload: MotionPreloadStrategy.NONE,
    });
    refreshConfig(app);
    modelPaths[String(playerID)] = config.modelPath; // 更新字典中的 modelPath   
        // 鼠标跟踪方法
    if (config.mouseTrack == 1) {
        model.trackedPointers = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }];
    }
    model.scale.set(config.scale);
    // 模型的位置,x,y相较于窗口左上角
    model.x = config.positionX;
    model.y = config.positionY;
    if (config.stopBreath == 1) {
        model.internalModel.angleXParamIndex = 999;
        model.internalModel.angleYParamIndex = 999;
        model.internalModel.angleZParamIndex = 999;
        model.internalModel.bodyAngleXParamIndex = 999;
        model.internalModel.breathParamIndex = 999;
    }
    const a = new InternalModel(model);
    model.InternalModel = a;

    model.on('pointerdown', (hitAreas) => {
        const { x, y } = hitAreas.data.global;
        model.motion("idle");
    });

    draggable(model);
    //addFrame(model);

    console.log(model);

    const audioCtx = new AudioContext();
    const analyser = audioCtx.createAnalyser();
    const frequencyData = new Uint8Array(analyser.frequencyBinCount);
    app.stage.addChild(model);
    live2DModels[playerID] = model;
    loadAndPlayAudio(audioCtx, analyser, model, playerID);
}

function removelive2d(app, playerID) {
    const model = live2DModels[playerID];
    if (model) {
        app.stage.removeChild(model); // 从舞台上移除模型
        delete live2DModels[playerID]; // 从字典中删除记录
    }
}

/*
function addFrame(model) {
    const foreground = PIXI.Sprite.from(PIXI.Texture.WHITE);
    foreground.width = model.internalModel.width;
    foreground.height = model.internalModel.height;
    foreground.alpha = 0.2;

    model.addChild(foreground);
    foreground.visible = true;
}*/

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

const getByteFrequencyData = (analyser, frequencyData) => {
    analyser.getByteFrequencyData(frequencyData);
    return frequencyData;
};

// 添加函数来获取和应用动作
async function loadAndApplyMotion(model,live2dmotion,live2dexpression) {
    //model.expression(live2dexpression);
    model.motion(live2dmotion, undefined, "IDLE");
}

async function loadAndPlayAudio(audioCtx, analyser, model, playerID) {
    let text;
    let live2dmotion;
    let live2dexpression;
    try {//获取待读文本
        text = config.text.response; // 获取文本内容
        live2dmotion = config.text.motion; // 获取模型信息
        live2dexpression = config.text.expression;
    } catch (error) {
        console.error('Failed to get text from the server', error);
        return;
    }

    if (text === previousText) {
            model.idleMotionPriority = "wait";
            setTimeout(() => {
                loadAndPlayAudio(audioCtx, analyser, model,playerID);
            }, 100);
            return;
    }

    if (config.playerID != playerID) {
        model.idleMotionPriority = "wait";
        setTimeout(() => {
            loadAndPlayAudio(audioCtx, analyser, model,playerID);
        }, 100);
        return; 
    }

    await loadAndApplyMotion(model,live2dmotion,live2dexpression);
    previousText = text;  
    //将文本发送至tts服务
    const request = new XMLHttpRequest();
    request.open('GET', `${config.ttsApiBaseUrl}&speaker=${config.speaker}&text=${encodeURIComponent(text)}`, true);
    request.responseType = 'arraybuffer';
    request.onload = () => {
        audioCtx.decodeAudioData(request.response, (buffer) => {
            const source = audioCtx.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtx.destination);
            source.connect(analyser);
            source.start(0);

            source.onended = () => {
                if (playingStatus[playerID]) {
                    playingStatus[playerID] = false;
                    loadAndPlayAudio(audioCtx, analyser, model, playerID);
                }
            };

            const setMouthOpenY = v => {
                v = Math.max(0, Math.min(1, v));
                //如果使用三代live2d模型
                //model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',v);
                model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', v);
            };

            playingStatus[playerID] = true;
            const o = 100;//响度上限
            const arrayAdd = a => a.reduce((i, a) => i + a, 0);

            const run = () => {
                if (!playingStatus[playerID]) return;
                const frequencyData = getByteFrequencyData(analyser, new Uint8Array(analyser.frequencyBinCount));
                const arr = [];
                for (let i = 0; i < config.volum; i += o) {
                    arr.push(frequencyData[i]);
                }
                setMouthOpenY((arrayAdd(arr) / arr.length - config.volum/*响度下限 */) / 60);
                //频率
                setTimeout(run, config.frequence);
            };
            run();

        });
    };
    request.send();

}
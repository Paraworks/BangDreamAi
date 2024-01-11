import * as PIXI from 'pixi.js';
import {
    Live2DModel,
    MotionPreloadStrategy,
    InternalModel,
} from 'pixi-live2d-display';

window.PIXI = PIXI;

let previousText = ''; 
let config  = {};
let configpath = {};
let lastmodelPath = {};
let settingconfig = {};
export async function init() {
    const request = new XMLHttpRequest();
    const configResponse = await fetch('get-temp-config');
    settingconfig = await configResponse.json();
    configpath = settingconfig.configurl;
    request.open('GET', configpath, true);
    request.onload = function() {
        if (this.status >= 200 && this.status < 400) {
            // 成功获取响应
            config = JSON.parse(this.response);
            startApp();
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
function refreshConfig() {
    setInterval(() => {
        const request = new XMLHttpRequest();
        request.open('GET', configpath, true);
        request.onload = function() {
            if (this.status >= 200 && this.status < 400) {
                config = JSON.parse(this.response);
                if (config.modelPath != lastmodelPath) {
                    window.location.reload();
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



async function startApp() {
    refreshConfig();
    const model = await Live2DModel.from(config.modelPath, {
        motionPreload: MotionPreloadStrategy.NONE,
    });
    lastmodelPath = config.modelPath;
    const app = new PIXI.Application({
        view: document.getElementById('canvas_view'),
        transparent: true,
        autoDensity: true,
        autoResize: true,
        antialias: true,
        height: '1080',
        width: '1800',
    });

    //model.trackedPointers = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }];
    app.stage.addChild(model);
    model.scale.set(0.3);
    model.x = 0;

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

    loadAndPlayAudio(audioCtx, analyser, model);
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

async function loadAndPlayAudio(audioCtx, analyser, model) {
  let text;
  let live2dmotion;
  let live2dexpression;
  try {//获取待读文本
    const response = await fetch(config.textApiBaseUrl);
    const data = await response.json(); // 解析 JSON 对象
    
    // 现在您可以访问 data.text, data.model 和 data.expression
    text = data.text; // 获取文本内容
    live2dmotion = data.motion; // 获取模型信息
    live2dexpression = data.expression; // 获取表情信息
} catch (error) {
    console.error('Failed to get text from the server', error);
    return;
}

if (text === previousText) {
    model.idleMotionPriority = "wait";
    setTimeout(() => {
        loadAndPlayAudio(audioCtx, analyser, model);
    }, 100);
    return;
}
if (text !== previousText) {
    // 只有在文本改变时才获取和应用新动作
    await loadAndApplyMotion(model,live2dmotion,live2dexpression);
}

previousText = text;  
  //将文本发送至tts服务
  const request = new XMLHttpRequest();
  request.open('GET', `${config.ttsApiBaseUrl}text=${encodeURIComponent(text)}`, true);
  request.responseType = 'arraybuffer';
  request.onload = () => {
      audioCtx.decodeAudioData(request.response, (buffer) => {
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.connect(analyser);
          source.start(0);

          source.onended = () => {
              loadAndPlayAudio(audioCtx, analyser, model);
          };

          const setMouthOpenY = v => {
              v = Math.max(0, Math.min(1, v));
              //如果使用三代live2d模型
              //model.internalModel.coreModel.setParameterValueById('ParamMouthOpenY',v);
              model.internalModel.coreModel.setParamFloat('PARAM_MOUTH_OPEN_Y', v);
          };

          let playing = true;
          const o = 100;//响度上限
          const arrayAdd = a => a.reduce((i, a) => i + a, 0);

          const run = () => {
              if (!playing) return;
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
  request.send();}
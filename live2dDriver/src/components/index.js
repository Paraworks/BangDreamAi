import * as PIXI from 'pixi.js';
import {
    Live2DModel,
    MotionPreloadStrategy,
    InternalModel,
} from 'pixi-live2d-display';

window.PIXI = PIXI;

let previousText = ''; 
let config  = {};
export async function init() {
    // 加载配置文件
    try {
        const configResponse = await fetch('../config.json');
        config = await configResponse.json();
        await startApp();
    } catch (error) {
        console.error('Failed to load config:', error);
    }
}


async function startApp() {
    const model = await Live2DModel.from(config.modelPath, {
        motionPreload: MotionPreloadStrategy.NONE,
    });

    const app = new PIXI.Application({
        view: document.getElementById('canvas_view'),
        transparent: true,
        autoDensity: true,
        autoResize: true,
        antialias: true,
        height: '1080',
        width: '1800',
    });

    model.trackedPointers = [{ id: 1, type: 'pointerdown', flags: true }, { id: 2, type: 'mousemove', flags: true }];
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

async function loadAndPlayAudio(audioCtx, analyser, model) {
  let text;
  try {//获取待读文本
    const response = await fetch(config.textApiBaseUrl);
    text = await response.text();
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

previousText = text;  
  //将文本发送至tts服务
  const request = new XMLHttpRequest();
  request.open('GET', `${config.ttsApiBaseUrl}?text=${encodeURIComponent(text)}`, true);
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
          const o = 80;
          const arrayAdd = a => a.reduce((i, a) => i + a, 0);

          const run = () => {
              if (!playing) return;
              const frequencyData = getByteFrequencyData(analyser, new Uint8Array(analyser.frequencyBinCount));
              const arr = [];
              for (let i = 0; i < 1000; i += o) {
                  arr.push(frequencyData[i]);
              }
              setMouthOpenY((arrayAdd(arr) / arr.length - 20) / 60);
              setTimeout(run, 1000 / 30);
          };
          run();

      });
  };
  request.send();}
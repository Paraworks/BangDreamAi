//设置sessionID为全局变量
let sessionId = window.sessionId;
document.addEventListener('DOMContentLoaded', function() {
    var live2dFrame = document.getElementById('live2d-frame');
    var serverUrl = 'http://localhost:5000/'; // 替换为实际的服务器地址
    live2dFrame.src = serverUrl  + window.sessionId;

});
// 全局变量存储 bandList 数据
let bandList = {};

// 在文档加载时获取 bandList 数据
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/listModels')
    .then(response => response.json())
    .then(data => {
        bandList = data;
        // 初始化文章编辑器等其他逻辑
    });
});

//控键
var currentVisible = 'chat-container';
var nextVisible = {
    'chat-container': 'user-config-container',
    'user-config-container': 'article-editor-container',
    'article-editor-container': 'chat-container'
};
document.getElementById('btn-toggle').addEventListener('click', function() {
    document.getElementById(currentVisible).style.display = 'none';
    currentVisible = nextVisible[currentVisible];
    document.getElementById(currentVisible).style.display = 'block';
});
document.getElementById('user-config-container').style.display = 'none';
document.getElementById('article-editor-container').style.display = 'none';
//聊天逻辑
document.getElementById('chat-form').addEventListener('submit', async function(event){
    event.preventDefault();
    const input = document.getElementById('user-input');
    const message = input.value;
    input.value = '';
    await sendMessage(message);
});
//聊天信息发送逻辑
async function sendMessage(message) {
    const modelPath = '/static/Resources/001_2018_halloween/model.json';

    try {
        const modelDataResponse = await fetch(modelPath); // 从服务器获取模型数据
        const modelData = await modelDataResponse.json();
        const motions = Object.keys(modelData.motions || {});
        const expressions = (modelData.expressions || []).map(exp => exp.name);

        const chatData = { message, modelPath, motions, expressions };

        const response = await fetch(`/api/chat/${sessionId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(chatData)
        });
        const chatResponse = await response.json();
        if (chatResponse.success) {
            displayResponse(chatResponse.text, chatResponse.motion, chatResponse.expression);
        } else {
            console.error("Error sending message");
        }
    } catch (error) {
        console.error("Error sending message: ", error);
    }
}
//用户配置逻辑
document.addEventListener('DOMContentLoaded', function(){
    fetch(`/api/content/${sessionId}/init/1`)
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('user-config-form');
        for (var key in data) {
            if (typeof data[key] === 'object' && data[key] !== null) {
                // 处理嵌套对象
                for (var nestedKey in data[key]) {
                    createInputField(form, `${key}.${nestedKey}`, data[key][nestedKey]);
                }
            } else {
                // 非嵌套对象的处理
                createInputField(form, key, data[key]);
            }
        }

        // 添加提交按钮
        var submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Confirm Changes';
        form.appendChild(submitButton);
    });
});

function createInputField(form, name, value) {
    var label = document.createElement('label');
    label.htmlFor = name;
    label.textContent = name + ': ';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;

    form.appendChild(label);
    form.appendChild(input);
    form.appendChild(document.createElement('br'));
}

//用户配置信息发送逻辑
document.getElementById('user-config-form').addEventListener('submit', function(event){
    event.preventDefault();
    var formData = {};
    var formElements = this.elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].name) {
            var keys = formElements[i].name.split('.');
            if (keys.length > 1) {
                // 处理嵌套对象
                if (!formData[keys[0]]) {
                    formData[keys[0]] = {};
                }
                formData[keys[0]][keys[1]] = formElements[i].value;
            } else {
                // 非嵌套对象
                formData[formElements[i].name] = formElements[i].value;
            }
        }
    }
    fetch(`/api/content/${sessionId}/init/1`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('Configuration updated!');
    })
    .catch(error => console.error('Error:', error));
});


//文章编辑逻辑
// 初始化 sessionID 输入字段
document.getElementById('session-id-input').value = sessionId;

// 加载文章按钮事件
document.getElementById('load-article-btn').addEventListener('click', function() {
    loadArticle(sessionId, document.getElementById('task-id-input').value);
});

document.getElementById('add-sentence-btn').addEventListener('click', function() {
    addSentence();
});

document.getElementById('save-article-btn').addEventListener('click', function() {
    var sessionId = document.getElementById('session-id-input').value;
    var taskId = document.getElementById('task-id-input').value;
    saveArticle(sessionId, taskId);
});

// 预览文章按钮事件
document.getElementById('preview-article-btn').addEventListener('click', function() {
    var sessionId = document.getElementById('session-id-input').value;
    var taskId = document.getElementById('task-id-input').value;
    previewArticle(sessionId, taskId);
});

function loadArticle(sessionId, taskId) {
    fetch(`/api/editor/${sessionId}/${taskId}`, { method: 'GET' })
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('article-editor-form');
        form.innerHTML = '';

        for (var sentenceId in data.contents) {
            createSentenceBlock(form, sentenceId, data.contents[sentenceId]);
            loadAudioFromBackend(sentenceId, data.contents[sentenceId]);
            loadImageFromBackend(sentenceId, data.contents[sentenceId]);
        }
    })
    .catch(error => console.error('Error:', error));
}

function loadAudioFromBackend(sentenceId, sentenceData) {
    var audioUrl = `${sentenceData.audiobaseUrl}${sessionId}/${sentenceData.audioname}`;
    var audioPreview = document.getElementById(`${sentenceId}-audio-preview`);
    if (audioPreview) {
        fetch(audioUrl)
        .then(response => response.blob())
        .then(blob => {
            audioPreview.src = URL.createObjectURL(blob);
        })
        .catch(error => console.error('Error loading audio:', error));
    }
}

function loadImageFromBackend(sentenceId, sentenceData) {
    var imageUrl = `${sentenceData.audiobaseUrl}${sessionId}/${sentenceData.background}`;
    var imagePreview = document.getElementById(`${sentenceId}-background-preview`);
    if (imagePreview) {
        fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            imagePreview.src = URL.createObjectURL(blob);
        })
        .catch(error => console.error('Error loading image:', error));
    }
}

// 预览文章函数
function previewArticle(sessionId, taskId) {
    var formData = collectFormData();
    fetch(`/api/display/${sessionId}/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('文章预览成功！');
        } else {
            alert('文章预览失败！');
        }
    })
    .catch(error => console.error('Error:', error));
}

function createSentenceBlock(form, sentenceId, sentenceData) {
    var sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'sentence-block';
    sentenceDiv.id = sentenceId;

    // 主要字段：text.response, speaker, band, playerID, modelPath, 音频预览
    createMainFields(sentenceDiv, sentenceId, sentenceData);
    //addDropdownsAndUpdateButton(sentenceDiv, sentenceId, sentenceData);
    // 其他字段的可展开区域
    var expandableDiv = document.createElement('div');
    expandableDiv.className = 'expandable';
    expandableDiv.style.display = 'none'; // 默认隐藏

    // 创建折叠字段
    for (var key in sentenceData) {
        if (key !== 'text' && key !== 'speaker' && key !== 'band' && key !== 'playerID' && key !== 'modelPath') {
            if (typeof sentenceData[key] === 'object' && sentenceData[key] !== null) {
                for (var nestedKey in sentenceData[key]) {
                    createInputField(expandableDiv, `${sentenceId}-${key}-${nestedKey}`, sentenceData[key][nestedKey]);
                }
            } else {
                createInputField(expandableDiv, `${sentenceId}-${key}`, sentenceData[key]);
            }
        }
    }

    // 切换按钮
    var toggleButton = document.createElement('button');
    toggleButton.textContent = '显示/隐藏更多设置';
    toggleButton.onclick = function() {
        event.preventDefault();
        expandableDiv.style.display = expandableDiv.style.display === 'none' ? 'block' : 'none';
    };

    sentenceDiv.appendChild(toggleButton);
    sentenceDiv.appendChild(expandableDiv);
    form.appendChild(sentenceDiv);
}

function addDropdownsAndUpdateButton(container, sentenceId, sentenceData) {
    // 创建下拉框
    var bandSelect = createDropdown(`${sentenceId}-band`, Object.keys(bandList));
    var speakerSelect = createDropdown(`${sentenceId}-speaker`, []);
    var modelSelect = createDropdown(`${sentenceId}-modelPath`, []);
    var motionSelect = createDropdown(`${sentenceId}-motion`, []);
    var expressionSelect = createDropdown(`${sentenceId}-expression`, []);

    // 更新按钮
    var updateButton = document.createElement('button');
    updateButton.textContent = '切换';
    updateButton.addEventListener('click', function() {
        event.preventDefault();
        updateSentenceData(sentenceId, {
            band: bandSelect.value,
            speaker: speakerSelect.value,
            modelPath: modelSelect.value,
            motion: motionSelect.value,
            expression: expressionSelect.value
        });
    });

    // 添加下拉框和按钮到容器
    container.appendChild(bandSelect);
    container.appendChild(speakerSelect);
    container.appendChild(modelSelect);
    container.appendChild(motionSelect);
    container.appendChild(expressionSelect);
    container.appendChild(updateButton);

    // 绑定事件以更新 speaker 和 modelPath 下拉框
    bandSelect.addEventListener('change', function() {
        updateSpeakerAndModelOptions(bandSelect.value, speakerSelect, modelSelect);
    });
}

function createDropdown(id, options) {
    var select = document.createElement('select');
    select.id = id;
    options.forEach(option => {
        var opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
    return select;
}

function updateSentenceData(sentenceId, data) {
    // 更新句子数据逻辑
    var sentenceDiv = document.getElementById(sentenceId);
    if (sentenceDiv) {
        // 更新输入字段值
        sentenceDiv.querySelector(`#${sentenceId}-band`).value = data.band;
        sentenceDiv.querySelector(`#${sentenceId}-speaker`).value = data.speaker;
        sentenceDiv.querySelector(`#${sentenceId}-modelPath`).value = data.modelPath;
        sentenceDiv.querySelector(`#${sentenceId}-motion`).value = data.motion;
        sentenceDiv.querySelector(`#${sentenceId}-expression`).value = data.expression;
    }
}

function updateSpeakerAndModelOptions(selectedBand, speakerSelect, modelSelect) {
    // 清空并更新 speakerSelect
    speakerSelect.innerHTML = '';
    Object.keys(bandList[selectedBand] || {}).forEach(speaker => {
        var opt = document.createElement('option');
        opt.value = speaker;
        opt.textContent = speaker;
        speakerSelect.appendChild(opt);
    });

    // 更新 modelSelect
    var firstSpeaker = Object.keys(bandList[selectedBand] || {})[0];
    updateModelOptions(selectedBand, firstSpeaker, modelSelect); // 修正：传递 selectedBand
}

function updateModelOptions(selectedBand, selectedSpeaker, modelSelect) {
    // 清空并更新 modelSelect
    modelSelect.innerHTML = '';
    var models = bandList[selectedBand][selectedSpeaker].models || [];
    models.forEach(model => {
        var opt = document.createElement('option');
        opt.value = model;
        opt.textContent = model;
        modelSelect.appendChild(opt);
    });
}

function initializeDropdowns(container, sentenceId, sentenceData) {
    // 创建下拉框和按钮
    var bandSelect = document.createElement('select');
    var speakerSelect = document.createElement('select');
    var modelSelect = document.createElement('select');
    var motionSelect = document.createElement('select');
    var expressionSelect = document.createElement('select');
    var updateButton = document.createElement('button');
    
    // 设置下拉框和按钮的 ID
    bandSelect.id = `${sentenceId}-band-select`;
    speakerSelect.id = `${sentenceId}-speaker-select`;
    modelSelect.id = `${sentenceId}-model-select`;
    motionSelect.id = `${sentenceId}-motion-select`;
    expressionSelect.id = `${sentenceId}-expression-select`;
    updateButton.id = `${sentenceId}-update-button`;

    // 填充乐队下拉框
    Object.keys(bandList).forEach(band => {
        var opt = document.createElement('option');
        opt.value = band;
        opt.textContent = band;
        bandSelect.appendChild(opt);
    });

    // 添加事件监听器
    bandSelect.addEventListener('change', function() {
        var selectedBand = bandSelect.value;
        updateSpeakerAndModelOptions(selectedBand, speakerSelect, modelSelect);
    });

    speakerSelect.addEventListener('change', function() {
        var selectedBand = bandSelect.value;
        var selectedSpeaker = speakerSelect.value;
        updateModelOptions(selectedBand, selectedSpeaker, modelSelect);
    });

    modelSelect.addEventListener('change', function() {
        var modelPath = modelSelect.value;
        fetchModelDataAndUpdateDropdowns(modelPath, motionSelect, expressionSelect);
    });

    updateButton.textContent = '更新';
    updateButton.addEventListener('click', function() {
        event.preventDefault();
        updateSentenceData(sentenceId, {
            band: bandSelect.value,
            speaker: speakerSelect.value,
            modelPath: modelSelect.value,
            motion: motionSelect.value,
            expression: expressionSelect.value
        });
    });

    // 将下拉框和按钮添加到容器中
    container.appendChild(bandSelect);
    container.appendChild(speakerSelect);
    container.appendChild(modelSelect);
    container.appendChild(motionSelect);
    container.appendChild(expressionSelect);
    container.appendChild(updateButton);

    // 初始化 speaker 和 model 下拉框
    var initialBand = bandSelect.value;
    updateSpeakerAndModelOptions(initialBand, speakerSelect, modelSelect);

    // 初始化 motion 和 expression 下拉框（如果 modelPath 已存在）
    if (sentenceData.modelPath) {
        fetchModelDataAndUpdateDropdowns(sentenceData.modelPath, motionSelect, expressionSelect);
    }

}

function fetchModelDataAndUpdateDropdowns(modelPath, motionSelect, expressionSelect) {
    // 删除 '../' 以适应服务器路径
    var serverModelPath = modelPath.replace('..', '');

    fetch(serverModelPath)
    .then(response => response.json())
    .then(modelData => {
        // 更新 motions 下拉框
        motionSelect.innerHTML = '';
        Object.keys(modelData.motions || {}).forEach(motion => {
            var opt = document.createElement('option');
            opt.value = motion;
            opt.textContent = motion;
            motionSelect.appendChild(opt);
        });

        // 更新 expressions 下拉框
        expressionSelect.innerHTML = '';
        (modelData.expressions || []).forEach(expression => {
            var opt = document.createElement('option');
            opt.value = expression.name;
            opt.textContent = expression.name;
            expressionSelect.appendChild(opt);
        });
    })
    .catch(error => console.error('Error fetching model data:', error));
}

function updateSentenceData(sentenceId, data) {
    // 更新句子数据逻辑
    var sentenceDiv = document.getElementById(sentenceId);
    if (sentenceDiv) {
        sentenceDiv.querySelector(`#${sentenceId}-band`).value = data.band;
        sentenceDiv.querySelector(`#${sentenceId}-speaker`).value = data.speaker;
        sentenceDiv.querySelector(`#${sentenceId}-modelPath`).value = data.modelPath;
        sentenceDiv.querySelector(`#${sentenceId}-text-motion`).value = data.motion;
        sentenceDiv.querySelector(`#${sentenceId}-text-expression`).value = data.expression;
    }
}

function createMainFields(container, sentenceId, sentenceData) {
    // 创建主要字段
    createInputField(container, `${sentenceId}-text-response`, sentenceData.text.response, true);
    createInputField(container, `${sentenceId}-text-motion`, sentenceData.text.motion, true);
    createInputField(container, `${sentenceId}-text-expression`, sentenceData.text.expression, true);
    createInputField(container, `${sentenceId}-speaker`, sentenceData.speaker);
    createInputField(container, `${sentenceId}-band`, sentenceData.band);
    createInputField(container, `${sentenceId}-playerID`, sentenceData.playerID);
    createInputField(container, `${sentenceId}-modelPath`, sentenceData.modelPath);

    addImageUploadAndPreview(container, sentenceId, sentenceData.background);

    // 初始化下拉框
    initializeDropdowns(container, sentenceId,sentenceData);

    // 添加音频上传标签和输入
    var audioLabel = document.createElement('label');
    audioLabel.textContent = '上传音频: ';
    container.appendChild(audioLabel);

    var audioInput = document.createElement('input');
    audioInput.type = 'file';
    audioInput.accept = 'audio/*';
    audioInput.id = `${sentenceId}-audio-input`;
    audioInput.addEventListener('change', function(event) {
        handleAudioUpload(event, sentenceId);
    });
    container.appendChild(audioInput);

    // 添加 TTS 音频获取按钮
    var fetchAudioButton = document.createElement('button');
    fetchAudioButton.textContent = '获取 TTS 音频';
    fetchAudioButton.addEventListener('click', function() {
        fetchTTSAudio(sentenceId);
    });
    container.appendChild(fetchAudioButton);

    // 添加音频预览元素
    var audioPreview = document.createElement('audio');
    audioPreview.controls = true;
    audioPreview.id = `${sentenceId}-audio-preview`;
    container.appendChild(audioPreview);
}

function addImageUploadAndPreview(container, sentenceId, imageName) {
    var imageLabel = document.createElement('label');
    imageLabel.textContent = '上传背景图片: ';
    container.appendChild(imageLabel);

    var imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.accept = 'image/*';
    imageInput.id = `${sentenceId}-background-input`;
    imageInput.addEventListener('change', function(event) {
        handleImageUpload(event, sentenceId);
    });
    container.appendChild(imageInput);

    var imagePreview = document.createElement('img');
    imagePreview.id = `${sentenceId}-background-preview`;
    imagePreview.className = "image-preview";
    container.appendChild(imagePreview);

    // 尝试加载现有的背景图片
    if (imageName) {
        loadImageFromBackend(sentenceId, imageName);
    }
}


function handleAudioUpload(event, sentenceId) {
    var file = event.target.files[0];
    if (file) {
        var audioPreview = document.getElementById(`${sentenceId}-audio-preview`);
        audioPreview.src = URL.createObjectURL(file);
    }
}

function handleImageUpload(event, sentenceId) {
    var file = event.target.files[0];
    if (file) {
        var imagePreview = document.getElementById(`${sentenceId}-background-preview`);
        imagePreview.src = URL.createObjectURL(file);
    }
}


function fetchTTSAudio(sentenceId, sentenceData) {
    event.preventDefault();
    var responseInput = document.getElementById(`${sentenceId}-text-response`);
    var text = responseInput ? responseInput.value : '';
    var ttsApiBaseUrl = document.getElementById(`${sentenceId}-ttsApiBaseUrl`).value;
    var speaker = document.getElementById(`${sentenceId}-speaker`).value;
    var ttsUrl = `${ttsApiBaseUrl}&speaker=${speaker}&text=${encodeURIComponent(text)}`;

    fetch(ttsUrl)
    .then(response => response.blob())
    .then(blob => {
        var audioPreview = document.getElementById(`${sentenceId}-audio-preview`);
        audioPreview.src = URL.createObjectURL(blob);
    })
    .catch(error => console.error('Error fetching TTS audio:', error));
}



function createInputField(container, name, value, isLarge = false) {
    var label = document.createElement('label');
    label.htmlFor = name;
    label.textContent = name.replace(/-/g, ' ') + ': ';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;

    if (isLarge) {
        input.style.width = '100%'; // 让文本输入框更宽
    }

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}

function addSentence() {
    var form = document.getElementById('article-editor-form');
    var sentenceCount = form.getElementsByClassName('sentence-block').length;
    var newSentenceId = 'sentence_' + (sentenceCount + 1);

    // 如果是第一个句子，使用默认配置，否则复制上一个句子的配置
    var lastSentenceData = sentenceCount > 0 ? collectSentenceData(form.children[sentenceCount - 1]) : getDefaultSentenceData();
    lastSentenceData.sentenceId = sentenceCount + 1;  // 更新句子编号
    lastSentenceData.audioname = `${document.getElementById('task-id-input').value}_${lastSentenceData.sentenceId}.wav`;  // 更新音频文件名

    createSentenceBlock(form, newSentenceId, lastSentenceData);
}

function getDefaultSentenceData() {
    return {
        sessionID: document.getElementById('session-id-input').value,
        taskID: document.getElementById('task-id-input').value,
        sentenceId: 1,
        playerID: 1,
        modelPath: null,
        ttsApiBaseUrl: "http://127.0.0.1:8000/?is_chat=false",
        textApiBaseUrl: "http://127.0.0.1:5000/api/sentence/test",
        audiobaseUrl: "/api/file/",
        audioname: "user1_story_1_1.wav",
        text: {
            expression: null,
            motion: null,
            response: "第一句话"
        },
        frequence: 0.5,
        volum: 70,
        duration: 2,
        background: "114.png",
        speaker: "香澄",
        band: "PoppinParty",
        positionX: 300,
        positionY: 50,
        stopBreath: 0,
        mouseTrack: 1,
        scale: 0.3
    };
}

function collectSentenceData(sentenceDiv) {
    var data = {};
    var inputs = sentenceDiv.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i++) {
        var input = inputs[i];
        var keys = input.name.split('-');
        if (keys.length === 3) {
            var key = keys[1];
            var nestedKey = keys[2];
            if (!data[key]) {
                data[key] = {};
            }
            data[key][nestedKey] = input.value;
        } else if (keys.length === 2) {
            data[keys[1]] = input.value;
        }
    }
    return data;
}

function saveArticle(sessionId, taskId) {
    var formData = collectFormData();

    // 保存文章内容
    fetch(`/api/editor/${sessionId}/${taskId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('文章已保存！');
        } else {
            alert('保存文章失败！');
        }
    })
    .catch(error => console.error('Error:', error));

    // 上传音频文件
    var sentenceBlocks = document.getElementsByClassName('sentence-block');
    for (var i = 0; i < sentenceBlocks.length; i++) {
        var sentenceDiv = sentenceBlocks[i];
        var sentenceId = sentenceDiv.id;

        // 上传音频文件
        var audioPreview = document.getElementById(`${sentenceId}-audio-preview`);
        var audioName = formData.contents[sentenceId].audioname;
        if (audioPreview && audioPreview.src) {
            uploadAudioFile(sessionId, audioName, audioPreview.src);
        }

        // 上传背景图片
        var imageInput = document.getElementById(`${sentenceId}-background-input`);
        if (imageInput && imageInput.files.length > 0) {
            var imageName = formData.contents[sentenceId].background; // 使用表单中的背景文件名
            uploadImageFile(sessionId, imageName, imageInput.files[0]);
        }
    }
}

function uploadImageFile(sessionId, imageName, file) {
    var formData = new FormData();
    formData.append('file', file, imageName);

    fetch(`/api/upload/${sessionId}`, {
        method: 'POST',
        headers: { 'uploadfile': imageName },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Image file uploaded successfully');
        } else {
            console.log('Failed to upload image file');
        }
    })
    .catch(error => console.error('Error uploading image file:', error));
}


function uploadAudioFile(sessionId, audioName, audioSrc) {
    fetch(audioSrc)
    .then(response => response.blob())
    .then(blob => {
        var formData = new FormData();
        formData.append('file', blob, audioName);

        fetch(`/api/upload/${sessionId}`, {
            method: 'POST',
            headers: { 'uploadfile': audioName },
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('Audio file uploaded successfully');
            } else {
                console.log('Failed to upload audio file');
            }
        })
        .catch(error => console.error('Error uploading audio file:', error));
    });
}


function collectFormData() {
    var form = document.getElementById('article-editor-form');
    var formData = {
        sessionID: document.getElementById('session-id-input').value,
        taskID: document.getElementById('task-id-input').value,
        contents: {}
    };

    var sentenceBlocks = form.getElementsByClassName('sentence-block');
    for (var i = 0; i < sentenceBlocks.length; i++) {
        var sentenceDiv = sentenceBlocks[i];
        var sentenceId = sentenceDiv.id;
        formData.contents[sentenceId] = {};

        var inputs = sentenceDiv.getElementsByTagName('input');
        for (var j = 0; j < inputs.length; j++) {
            var input = inputs[j];
            var keys = input.name.split('-'); // 分解name属性，格式为 "sentenceId-key" 或 "sentenceId-key-nestedKey"
            
            if (keys.length === 3) {
                // 嵌套对象的处理
                var key = keys[1];
                var nestedKey = keys[2];
                if (!formData.contents[sentenceId][key]) {
                    formData.contents[sentenceId][key] = {};
                }
                formData.contents[sentenceId][key][nestedKey] = input.value;
            } else if (keys.length === 2) {
                // 非嵌套对象的处理
                formData.contents[sentenceId][keys[1]] = input.value;
            }
        }
    }

    return formData;
}


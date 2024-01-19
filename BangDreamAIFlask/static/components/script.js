//设置sessionID为全局变量
let sessionId = window.sessionId;
document.addEventListener('DOMContentLoaded', function() {
    var live2dFrame = document.getElementById('live2d-frame');
    var serverUrl = 'http://localhost:5000/'; // 替换为实际的服务器地址
    live2dFrame.src = serverUrl  + window.sessionId;

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

    // 创建输入字段
    for (var key in sentenceData) {
        if (typeof sentenceData[key] === 'object' && sentenceData[key] !== null) {
            // 处理嵌套对象
            for (var nestedKey in sentenceData[key]) {
                createInputField(sentenceDiv, `${sentenceId}-${key}-${nestedKey}`, sentenceData[key][nestedKey]);
            }
        } else {
            // 非嵌套对象的处理
            createInputField(sentenceDiv, `${sentenceId}-${key}`, sentenceData[key]);
        }
    }

    // 删除句子按钮
    var deleteButton = document.createElement('button');
    deleteButton.textContent = '删除句子';
    deleteButton.addEventListener('click', function() {
        sentenceDiv.remove();
    });
    sentenceDiv.appendChild(deleteButton);

    form.appendChild(sentenceDiv);
}

function createInputField(container, name, value) {
    var label = document.createElement('label');
    label.htmlFor = name;
    label.textContent = name.replace(/-/g, ' ') + ': ';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;

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
    lastSentenceData.audioname = `user1_story_1_${lastSentenceData.sentenceId}.wav`;  // 更新音频文件名

    createSentenceBlock(form, newSentenceId, lastSentenceData);
}

function getDefaultSentenceData() {
    return {
        sessionID: document.getElementById('session-id-input').value,
        taskID: document.getElementById('task-id-input').value,
        sentenceId: 1,
        playerID: 1,
        modelPath: "../static/Resources/002_2018_dog/model.json",
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
            alert('保存失败！');
        }
    })
    .catch(error => console.error('Error:', error));
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



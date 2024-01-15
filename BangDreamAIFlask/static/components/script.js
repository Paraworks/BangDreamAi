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
    const sessionId = 'test'; 
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
    fetch('/api/content/test/init/1')
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('user-config-form');
        for (var key in data) {
            var label = document.createElement('label');
            label.htmlFor = key;
            label.textContent = key + ': ';

            var input = document.createElement('input');
            input.type = 'text';
            input.id = key;
            input.name = key;
            input.value = data[key];

            form.appendChild(label);
            form.appendChild(input);
            form.appendChild(document.createElement('br'));
        }

        // Add a submit button to the form
        var submitButton = document.createElement('button');
        submitButton.type = 'submit';
        submitButton.textContent = 'Confirm Changes';
        form.appendChild(submitButton);
    });
});
//用户配置信息发送逻辑
document.getElementById('user-config-form').addEventListener('submit', function(event){
    event.preventDefault();
    var formData = {};
    var formElements = this.elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].name) {
            formData[formElements[i].name] = formElements[i].value;
        }
    }
    fetch('/api/content/test/init/1', {  // Update this URL to your actual endpoint
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
document.addEventListener('DOMContentLoaded', function() {
    fetch('/api/editor/test/init')  // 替换为获取文章数据的实际 URL
    .then(response => response.json())
    .then(data => {
        var form = document.getElementById('article-editor-form');

        // 显示 task 的内容
        displayTaskData(form, data.task);

        // 为每个句子创建一个块
        for (var sentenceId in data.contents) {
            createSentenceBlock(form, sentenceId, data.contents[sentenceId]);
        }
    });
});

function displayTaskData(form, taskData) {
    var taskDiv = document.createElement('div');
    taskDiv.className = 'task-data';
    for (var key in taskData) {
        var p = document.createElement('p');
        p.textContent = key + ': ' + taskData[key];
        taskDiv.appendChild(p);
    }
    form.appendChild(taskDiv);
}

function createSentenceBlock(form, sentenceId, sentenceData) {
    var sentenceDiv = document.createElement('div');
    sentenceDiv.className = 'sentence-block';
    sentenceDiv.id = sentenceId;

    // 句子名称
    var sentenceName = document.createElement('h3');
    sentenceName.textContent = sentenceId;
    sentenceDiv.appendChild(sentenceName);

    // 创建输入字段
    for (var key in sentenceData) {
        if (typeof sentenceData[key] === 'object' && sentenceData[key] !== null) {
            for (var nestedKey in sentenceData[key]) {
                createInputField(sentenceDiv, `${sentenceId}-${nestedKey}`, sentenceData[key][nestedKey]);
            }
        } else {
            createInputField(sentenceDiv, `${sentenceId}-${key}`, sentenceData[key]);
        }
    }

    // 增加句子按钮
    var addButton = document.createElement('button');
    addButton.textContent = '增加句子';
    addButton.addEventListener('click', function() {
        addSentence(sentenceId);
    });
    sentenceDiv.appendChild(addButton);

    form.appendChild(sentenceDiv);
}

function createInputField(container, name, value) {
    var label = document.createElement('label');
    label.htmlFor = name;
    label.textContent = name + ': ';

    var input = document.createElement('input');
    input.type = 'text';
    input.id = name;
    input.name = name;
    input.value = value;

    container.appendChild(label);
    container.appendChild(input);
    container.appendChild(document.createElement('br'));
}

function addSentence(sentenceId) {
    // 获取当前句子编号的最后一个数字，并计算下一个句子的编号
    var nextSentenceNumber = parseInt(sentenceId.match(/\d+$/)[0]) + 1;
    var nextSentenceId = 'sentence_' + nextSentenceNumber;
    fetch(`/api/create/test/init/${nextSentenceNumber}`, { method: 'GET' }) // 替换为创建新句子的实际 URL
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 在界面上添加新句子的块
            var form = document.getElementById('article-editor-form');
            createSentenceBlock(form, nextSentenceId, {}); // 假设新句子初始为空对象
        } else {
            alert('创建新句子失败');
        }
    })
    .catch(error => console.error('Error:', error));
    }

    document.getElementById('article-editor-form').addEventListener('submit', function(event) {
    event.preventDefault();
    var formData = {
    task: {}, // 假设 task 数据不在这里处理
    contents: {}
    };
    var formElements = this.elements;
    for (var i = 0; i < formElements.length; i++) {
        if (formElements[i].name) {
            var keys = formElements[i].name.split('-');
            var sentenceId = keys[0];
            var property = keys[1];

            if (!formData.contents[sentenceId]) {
                formData.contents[sentenceId] = {};
            }

            formData.contents[sentenceId][property] = formElements[i].value;
        }
    }

    fetch('/api/editor/test/init', {  // 替换为保存文章数据的实际 URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        alert('文章已更新！');
    })
    .catch(error => console.error('Error:', error));
});
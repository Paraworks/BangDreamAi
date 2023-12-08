//script.js
let live2dUrlPath;

function sendMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value;

    // 检查输入是否为空
    if (!message.trim()) {
        alert('请输入消息');
        return;
    }

    // 构建发送到后端的数据
    const data = { message: message };

    // 发送消息到后端
    fetch('/sendMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        // 确保从 JSON 对象中提取 'text' 字段
        const replyText = data.text || "无回复";
        // 在聊天界面显示回复
        displayMessage('You: ' + message);
        displayMessage('Bot: ' + replyText);
    })
    .catch(error => {
        console.error('发送消息失败:', error);
    });

    // 清空输入框
    input.value = '';
}

// 显示消息的函数
function displayMessage(message) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    chatBox.appendChild(messageElement);

    // 滚动到最新消息
    chatBox.scrollTop = chatBox.scrollHeight;
}


function updateConfig() {
    // 构建新的配置对象
    const newConfig = {
        modelPath: document.getElementById('config-modelPath').value,
        ttsApiBaseUrl: document.getElementById('config-ttsApiBaseUrl').value,
        textApiBaseUrl: document.getElementById('config-textApiBaseUrl').value,
        live2dUrlPath: document.getElementById('config-live2dUrlPath').value, 
        chatbotApiUrl: document.getElementById('config-chatbotApiUrl').value,
        volum: parseFloat(document.getElementById('config-volum').value),
        openV: parseInt(document.getElementById('config-openV').value)
    };

    // 发送配置更新的请求
    fetch('/updateConfig', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newConfig)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        // 重新加载 live2d-frame
        const live2dFrame = document.getElementById('live2d-frame');
        live2dFrame.src = live2dUrlPath + "?model=" + encodeURIComponent(newConfig.modelPath); // 确保每次加载新的模型
    })
    .catch(error => console.error('配置更新失败:', error));
}



function toggleConfig() {
    const configContainer = document.getElementById('config-container');
    configContainer.style.display = configContainer.style.display === 'none' ? 'block' : 'none';
}

function getConfig() {
    fetch('/getConfig')
        .then(response => response.json())
        .then(config => {
            live2dUrlPath = config.live2dUrlPath;
            document.getElementById('config-modelPath').value = config.modelPath;
            document.getElementById('config-ttsApiBaseUrl').value = config.ttsApiBaseUrl;
            document.getElementById('config-textApiBaseUrl').value = config.textApiBaseUrl;
            document.getElementById('config-live2dUrlPath').value = config.live2dUrlPath || live2dUrlPath;
            document.getElementById('config-chatbotApiUrl').value = config.chatbotApiUrl || chatbotApiUrl;
            document.getElementById('config-volum').value = config.volum;
            document.getElementById('config-openV').value = config.openV;
            // 如果有其他配置项，也在这里更新它们
        })
        .catch(error => console.error('获取配置失败:', error));
}

window.onload = getConfig; // 页面加载时获取当前配置

//script.js
const live2dUrlPath = "http://localhost:5173/";

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
    const configInput = document.getElementById('config-input');
    const config = JSON.parse(configInput.value);
    fetch('/updateConfig', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })
    .then(response => response.text())
    .then(message => {
        alert(message);
        // 重新加载 live2d-frame
        const live2dFrame = document.getElementById('live2d-frame');
        live2dFrame.src = live2dUrlPath;
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
            document.getElementById('config-input').value = JSON.stringify(config, null, 2);
        })
        .catch(error => console.error('获取配置失败:', error));
}

window.onload = getConfig; // 页面加载时获取当前配置

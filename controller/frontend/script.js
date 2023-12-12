//script.js
let live2dUrlPath;

const BandList = {
        "PoppinParty":["香澄","有咲","たえ","りみ","沙綾"],
        "Afterglow":["蘭","モカ","ひまり","巴","つぐみ"],
        "HelloHappyWorld":["こころ","美咲","薫","花音","はぐみ"],
        "PastelPalettes":["彩","日菜","千聖","イヴ","麻弥"],
        "Roselia":["友希那","紗夜","リサ","燐子","あこ"],
        "RaiseASuilen":["レイヤ","ロック","ますき","チュチュ","パレオ"],
        "Morfonica":["ましろ","瑠唯","つくし","七深","透子"],
        "MyGo":["燈","愛音","そよ","立希","楽奈"],
        "AveMujica":["祥子","睦","海鈴","にゃむ","初華"],
        "圣翔音乐学园":["華戀","光","香子","雙葉","真晝","純那","克洛迪娜","真矢","奈奈"],
        "凛明馆女子学校":["珠緒","壘","文","悠悠子","一愛"],
        "弗隆提亚艺术学校":["艾露","艾露露","菈樂菲","司","靜羽"],
        "西克菲尔特音乐学院":["晶","未知留","八千代","栞","美帆"]
};

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
        frequence: parseFloat(document.getElementById('config-frequence').value),
        volum: parseInt(document.getElementById('config-volum').value),
        upper: parseInt(document.getElementById('config-upper').value)
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

function loadModelPaths() {
    fetch('/listModels')
        .then(response => response.json())
        .then(models => {
            const modelPathSelect = document.getElementById('config-modelPath');
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = `../Resources/${model}/model.json`;
                option.textContent = model;
                modelPathSelect.appendChild(option);
            });
        })
        .catch(error => console.error('加载模型路径失败:', error));
}

function getConfig() {
    fetch('/getConfig')
        .then(response => response.json())
        .then(config => {
            live2dUrlPath = config.live2dUrlPath;
            document.getElementById('config-ttsApiBaseUrl').value = config.ttsApiBaseUrl;
            document.getElementById('config-textApiBaseUrl').value = config.textApiBaseUrl;
            document.getElementById('config-live2dUrlPath').value = config.live2dUrlPath || live2dUrlPath;
            document.getElementById('config-chatbotApiUrl').value = config.chatbotApiUrl || chatbotApiUrl;
            document.getElementById('config-frequence').value = config.frequence;
            document.getElementById('config-volum').value = config.volum;
            document.getElementById('config-upper').value = config.upper;
            document.getElementById('config-modelPath').value = config.modelPath;
            loadBandsAndSpeakers();// 加载tts speaker
            loadModelPaths(); // 加载模型路径
        })
        .catch(error => console.error('获取配置失败:', error));
}

//选择TTS speaker
function updateSpeakerSelect(band) {
    const speakerSelect = document.getElementById('config-speaker');
    speakerSelect.innerHTML = ''; // 清空之前的选项
    BandList[band].forEach(speaker => {
        const option = document.createElement('option');
        option.value = speaker;
        option.textContent = speaker;
        speakerSelect.appendChild(option);
    });
}

function updateTtsApiUrl() {
    const band = document.getElementById('config-band').value;
    const speaker = document.getElementById('config-speaker').value;
    document.getElementById('config-ttsApiBaseUrl').value = `http://127.0.0.1:5000/tts?speaker=${speaker}&`;
}

function loadBandsAndSpeakers() {
    const bandSelect = document.getElementById('config-band');
    Object.keys(BandList).forEach(band => {
        const option = document.createElement('option');
        option.value = band;
        option.textContent = band;
        bandSelect.appendChild(option);
    });

    // 初始化成员下拉框
    updateSpeakerSelect(Object.keys(BandList)[0]);
    updateTtsApiUrl();

    // 添加事件监听器
    bandSelect.addEventListener('change', () => {
        updateSpeakerSelect(bandSelect.value);
        updateTtsApiUrl();
    });

    const speakerSelect = document.getElementById('config-speaker');
    speakerSelect.addEventListener('change', () => {
        updateTtsApiUrl();
    });
}

window.onload = getConfig; // 页面加载时获取当前配置

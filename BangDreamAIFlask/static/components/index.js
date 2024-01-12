const BandList = {
    "PoppinParty":["香澄","りみ","たえ","沙綾","有咲"],
    "Afterglow":["蘭","モカ","ひまり","巴","つぐみ"],
    "HelloHappyWorld":["こころ","薫","はぐみ","花音","美咲"],
    "PastelPalettes":["彩","日菜","千聖","イヴ","麻弥"],
    "Roselia":["友希那","紗夜","リサ","あこ","燐子"],
    "RaiseASuilen":["レイヤ","ロック","ますき","チュチュ","パレオ"],
    "Morfonica":["ましろ","瑠唯","つくし","七深","透子"],
    "MyGo":["燈","愛音","そよ","立希","楽奈"],
    "AveMujica":["祥子","睦","海鈴","にゃむ","初華"],
    "圣翔音乐学园":["華戀","光","香子","雙葉","真晝","純那","克洛迪娜","真矢","奈奈"],
    "凛明馆女子学校":["珠緒","壘","文","悠悠子","一愛"],
    "弗隆提亚艺术学校":["艾露","艾露露","菈樂菲","司","靜羽"],
    "西克菲尔特音乐学院":["晶","未知留","八千代","栞","美帆"]
};

let ttsUrl = "http://127.0.0.1:8000";

// 获取 sessionId
function getSessionId() {
    return "test"; 
}

// 更新模型配置
async function updateModelConfig(config) {
    const sessionId = getSessionId();
    await fetch(`/api/content/${sessionId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(config)
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log("配置更新成功");
        } else {
            console.error("配置更新失败");
        }
    })
    .catch(error => console.error("更新配置时发生错误: ", error));
}

// 获取并显示最新配置
async function fetchAndUpdateConfig() {
    const sessionId = getSessionId();
    try {
        const tempConfigResponse = await fetch(`/api/get-temp-config`);
        const tempConfig = await tempConfigResponse.json();
        if (tempConfig && tempConfig.configurl) {
            const configResponse = await fetch(tempConfig.configurl);
            const configData = await configResponse.json();
            if (configData) {
                // 更新前端元素
                document.getElementById('config-band').value = configData.band || 'PoppinParty';
                document.getElementById('config-speaker').value = configData.speaker || '香澄';
                document.getElementById('config-ttsApiBaseUrl').value = configData.ttsApiBaseUrl;
                document.getElementById('frequency-input').value = configData.frequence || 0.5;
                document.getElementById('volume-input').value = configData.volum || 70;
                document.getElementById('upper-input').value = configData.upper || 800;
                const modelPathSelect = document.getElementById('model-path-select'); // 更新为新的下拉框 ID
            }
        }
    } catch (error) {
        console.error("Error fetching latest configuration: ", error);
    }
}

// 发送聊天信息
async function sendMessage(message) {
    const sessionId = getSessionId();
    const modelPathSelect = document.getElementById('model-path-select');
    const modelPath = modelPathSelect.value; // 获取当前选中的模型路径

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

// 获取聊天机器人的回复
async function getChatResponse(sessionId) {
    await fetch(`/api/sentence/${sessionId}`)
    .then(response => response.json())
    .then(responseData => {
        displayResponse(responseData.response);
    })
    .catch(error => console.error("Error fetching sentence: ", error));
}

// 显示聊天机器人的回复
function displayResponse(responseText) {
    // 在这里添加逻辑来显示聊天机器人的回复
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.textContent = responseText;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

document.getElementById('send-button').addEventListener('click', async function() {
    const input = document.getElementById('chat-input');
    const message = input.value;
    input.value = '';
    await sendMessage(message);
});

document.getElementById('apply-settings').addEventListener('click', async function() {
    const frequency = document.getElementById('frequency-input').value;
    const volume = document.getElementById('volume-input').value;
    const upper = document.getElementById('upper-input').value;
    const modelPath = document.getElementById('model-path-select').value;
    const band = document.getElementById('config-band').value;
    const speaker = document.getElementById('config-speaker').value;

    // 生成新的 ttsApiBaseUrl
    const ttsApiBaseUrl = `${ttsUrl}?speaker=${encodeURIComponent(speaker)}&`;

    await updateModelConfig({ frequency, volume, upper, modelPath, ttsApiBaseUrl, band, speaker });
});

// 页面加载时获取最新配置
document.addEventListener('DOMContentLoaded', fetchAndUpdateConfig);

// 页面加载时填充乐队选择框
function loadBands() {
    const bandSelect = document.getElementById('config-band');
    Object.keys(BandList).forEach(band => {
        const option = document.createElement('option');
        option.value = band;
        option.textContent = band;
        bandSelect.appendChild(option);
    });
    bandSelect.value = Object.keys(BandList)[0]; // 设置默认乐队
    updateSpeakerSelect(bandSelect.value); // 更新成员选择框
}

// 更新乐队和成员的选择框
function updateSpeakerSelect(band) {
    const speakerSelect = document.getElementById('config-speaker');
    speakerSelect.innerHTML = ''; // 清空之前的选项
    BandList[band].forEach(speaker => {
        const option = document.createElement('option');
        option.value = speaker;
        option.textContent = speaker;
        speakerSelect.appendChild(option);
    });
    // 可以在这里设置默认值或触发更新
    speakerSelect.value = BandList[band][0]; // 设置为乐队的第一个成员
}

// 当选择的乐队变化时
document.getElementById('config-band').addEventListener('change', function() {
    const selectedBand = this.value;
    localStorage.setItem('selectedBand', selectedBand); // 存储当前乐队
    updateSpeakerSelect(selectedBand);
    updateModelPath(); // 更新模型路径
});

// 当选择的成员变化时
document.getElementById('config-speaker').addEventListener('change', function() {
    const selectedSpeaker = this.value;
    localStorage.setItem('selectedSpeaker', selectedSpeaker); // 存储当前成员
    updateTtsApiUrl();
    updateModelPath();
});

//更新TTS链接
function updateTtsApiUrl() {
    const selectedSpeaker = document.getElementById('config-speaker').value;

    // 更新 ttsApiBaseUrl 的值
    const ttsApiBaseUrlInput = document.getElementById('config-ttsApiBaseUrl');
    ttsApiBaseUrlInput.value = `${ttsUrl}?speaker=${encodeURIComponent(selectedSpeaker)}&`;
}


// 更新模型路径
function updateModelPath() {
    const band = document.getElementById('config-band').value;
    const speaker = document.getElementById('config-speaker').value;
    const modelPathSelect = document.getElementById('model-path-select'); // 使用正确的元素ID

    fetch('/api/listModels')
        .then(response => response.json())
        .then(models => {
            const speakerModelNumber = getMemberModelNumber(band, speaker);
            // 确保模型路径格式与预期相符
            const filteredModels = models.filter(model => model.includes(speakerModelNumber));

            modelPathSelect.innerHTML = ''; // 清空当前选项
            filteredModels.forEach(model => {
                const option = document.createElement('option');
                option.value = model;
                option.textContent = model.split('/').pop(); // 显示文件名
                modelPathSelect.appendChild(option);
            });
        })
        .catch(error => console.error('加载模型路径失败:', error));
}

document.getElementById('config-speaker').addEventListener('change', updateModelPath);

// 获取成员在BandList中的位置并转换为模型编号
function getMemberModelNumber(band, member) {
    let memberNumber = 1; // 从ksm开始计数
    for (const bandName in BandList) {
        if (bandName === band) {
            const memberIndex = BandList[bandName].indexOf(member);
            if (memberIndex !== -1) {
                memberNumber += memberIndex;
                break;
            }
        }
        memberNumber += BandList[bandName].length; // 为每个乐队增加成员数
    }
    return memberNumber.toString().padStart(3, '0'); // 转换为三位数字字符串
}

// 页面加载时执行
window.onload = function() {
    loadBands(); // 填充乐队选择框
    const firstBand = Object.keys(BandList)[0];
    updateSpeakerSelect(firstBand); // 更新第一个乐队的成员选择框
    updateModelPath(); // 更新模型路径
};
makeDraggable(document.getElementById('chat-container'));
makeDraggable(document.getElementById('control-panel'));
const fs = require('fs');
const http = require('http');

const configPath = '../live2dDriver/config.json';
let live2dData;
let chatbotApiUrl;

function loadConfigAndModel() {
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    const modelPath = config.modelPath.replace('..', '../live2dDriver');
    live2dData = require(modelPath);
    chatbotApiUrl = config.chatbotApiUrl || 'http://127.0.0.1:8080/chat'; // 默认值
}

function getChatbotResponse(message) {
    return new Promise((resolve, reject) => {
        // 获取所有可用的 motions 和 expressions
        const motionKeys = Object.keys(live2dData.motions);
        const expressionNames = live2dData.expressions.map(expr => expr.name);

        // 设置 HTTP 请求选项
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        // 创建请求
        const req = http.request(chatbotApiUrl, requestOptions, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const motion = response.motion || getRandomElement(motionKeys);
                    const expression = response.expression || getRandomElement(expressionNames);

                    resolve({
                        text: response.text || `回复失败: ${message}`,
                        motion: motion,
                        expression: expression
                    });
                } catch (error) {
                    resolve(getRandomMotionAndExpression()); // 使用默认随机行为
                }
            });
        });

        req.on('error', (error) => {
            console.error('请求聊天 API 失败:', error);
            resolve(getRandomMotionAndExpression()); // 使用默认随机行为
        });

        // 发送请求
        const payload = {
            message: message,
            motions: motionKeys,
            expressions: expressionNames
        };
        req.write(JSON.stringify(payload));
        req.end();
    });
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

loadConfigAndModel();
module.exports = { getChatbotResponse };


function getRandomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

loadConfigAndModel();
module.exports = { getChatbotResponse };

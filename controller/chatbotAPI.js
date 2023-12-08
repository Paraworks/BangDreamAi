// chatbotAPI.js
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

function getRandomMotionAndExpression() {
    const motionKeys = Object.keys(live2dData.motions);
    const expressionNames = live2dData.expressions.map(expr => expr.name);

    // 随机选择 motion 名称
    const randomMotionKey = motionKeys[Math.floor(Math.random() * motionKeys.length)];

    // 随机选择 expression 名称
    const randomExpressionName = expressionNames[Math.floor(Math.random() * expressionNames.length)];

    return {
        motion: randomMotionKey,
        expression: randomExpressionName
    };
}


// 模拟聊天机器人的回复
function getChatbotResponse(message) {
    const { motion, expression } = getRandomMotionAndExpression();

    return new Promise((resolve, reject) => {
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
                resolve({
                    text: data || `回复失败: ${message}`,
                    motion: motion,
                    expression: expression
                });
            });
        });

        req.on('error', (error) => {
            resolve({ // 使用 resolve 而非 reject，因为我们仍然返回一个回复
                text: `回复失败: ${message}`,
                motion: motion,
                expression: expression
            });
        });

        // 发送请求
        req.write(JSON.stringify({ message: message }));
        req.end();
    });
}

loadConfigAndModel();
module.exports = { getChatbotResponse };
// chatbotAPI.js
const live2dModelPath = "E:/WorkSpace/Upload/BangDreamAi/live2dDriver/Resources/mzl/mzl.model.json";

const live2dData = require(live2dModelPath);

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

    // 构建回复
    const reply = {
        text: `回复: ${message}`,
        motion: motion,
        expression: expression
    };

    return Promise.resolve(reply);
}

module.exports = { getChatbotResponse };
// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatbotAPI = require('./chatbotAPI');
const fs = require('fs');
const configPath = '../live2dDriver/config.json';
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('frontend'));

let latestReply = {
    text: "",
    model: "idle0",
    expression: "default"
};

// 聊天消息路由
app.post('/sendMessage', (req, res) => {
    const message = req.body.message;
    chatbotAPI.getChatbotResponse(message)
        .then(response => {
            latestReply = response; // 更新最新的回复
            res.json(response);
        })
        .catch(error => {
            res.status(500).send(error.message);
        });
});

// 更新配置路由
app.post('/updateConfig', (req, res) => {
    const newConfig = req.body;
    fs.writeFile(configPath, JSON.stringify(newConfig, null, 2), (err) => {
        if (err) {
            res.status(500).send('配置更新失败');
        } else {
            res.send('配置更新成功');
        }
    });
});


//  获取配置路由
app.get('/getConfig', (req, res) => {
    fs.readFile(configPath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send('无法读取配置文件');
        } else {
            res.send(data);
        }
    });
});

// 展示最新回复
app.get('/show', (req, res) => {
    res.json(latestReply);
});

// 获取模型列表
app.get('/listModels', (req, res) => {
    const modelsDir = path.join(__dirname, '../live2dDriver/Resources');
    fs.readdir(modelsDir, { withFileTypes: true }, (err, files) => {
        if (err) {
            res.status(500).send('无法读取模型目录');
        } else {
            const modelFolders = files.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);
            res.json(modelFolders);
        }
    });
});

app.listen(port, () => {
    console.log(`面板运行在 http://localhost:${port}`);
});

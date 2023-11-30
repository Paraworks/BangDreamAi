// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const chatbotAPI = require('./chatbotAPI');
const fs = require('fs');
const configPath = 'E:/WorkSpace/Upload/BangDreamAi/live2dDriver/config.json';

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('frontend'));
console.log('Serving static files from ../frontend');


// 聊天消息路由
app.post('/sendMessage', (req, res) => {
    const message = req.body.message;
    chatbotAPI.getChatbotResponse(message)
        .then(response => {
            res.json({ reply: response });
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


app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});

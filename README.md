# 邦邦特化AI聊天(2代live2d)
本分支为适应本地快速部署的轻量化版本，可从[main](https://github.com/Paraworks/BangDreamAi/tree/main)分支或者其它分支查看中小型网页部署版或开发版 
```
#本机部署
git clone https://github.com/Paraworks/BangDreamAi
pip install -r requirements.txt
python app.py
```
默认5000端口
## 配置live2d模型
BangDream的live2d可以直接从bestdori手动下载。Github上也有许多提取好的仓库
### [五团(卡面比较多)](https://github.com/seia-soto/BanG-Dream-Live2D)
### [七团](https://github.com/Eikanya/Live2d-model/tree/master/BanG%20Dream!)
### [b站北极暖水港大佬](https://pan.baidu.com/s/1FBYfLBzhIS50VkzrENfcrg?pwd=mq86#list/path=%2F)
### 你需要将这些模型放在[/static/Resources](https://github.com/Paraworks/BangDreamAi/tree/light/static/Resources)下
按照如下标准
```
/Resources/{乐队}/{角色}/{模型名}/model.json
```
这样程序可以自动识别乐队和角色,否则无法在前端选择
## 模型配置
如果没什么大问题，可以直接在前端页面配置，但也可以本地直接修改config.json
```
默认配置
{
    "api": "chatgpt",
    "apiKey": "",
    "apiLink": "",
    "band": "Afterglow",
    "duration": 2,
    "frequence": 0.5,
    "modelPath": "static/Resources/Afterglow/蘭/live/model.json",
    "mouseTrack": 1,
    "positionX": 300,
    "positionY": 50,
    "scale": 0.3,
    "speaker": "蘭",
    "stopBreath": 0,
    "text": {
        "response": "初始化成功",
        "expression": null,
        "motion": null
    },
    "textApiBaseUrl": "http://127.0.0.1:5000/api/sentence/test",
    "ttsApiBaseUrl": "http://127.0.0.1:8000/?is_chat=false",
    "volum": 70
}
```
## 启动TTS合成
[TTS(Bang dream Bert vits示例)](https://nijigaku.top/2023/10/03/BangDreamTTS/):
```
git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert
cd MyGO_VIts-bert
pip install -r requirements.txt
pip install Flask
pip install Flask-CORS
python server.py
```
## 自定义chatbot
由于在前端配置完apikey后，直接跑chatgpt也大概率跑不通,建议自行修改[chat.py](https://github.com/Paraworks/BangDreamAi/tree/light/chat.py)的相关配置以及逻辑
## To do list
自定义直播间管人配置(未完成)
```
{url}/{session_id}/{task_id}
```
## OBS 配置详解：
#### live2d 配置
- 来源 > + > 浏览器 > 新建 > URL：填入上一步生成的live2d链接，一般是localhost:xxxx
#### [弹幕姬](https://chat.bilisc.com/)
- 来源 > + > 浏览器 > 新建 > URL：参照[说明](https://chat.bilisc.com/help)填入链接以及css
#### B 站推流配置
- (obs内)设置（Preferences）> 直播 > 服务 > 自定义 > 填写 bilibili服务器以及推流码...
- 推流码填写「B 站首页 > 头像 > 推荐服务 > 直播中心 > 左侧“我的直播间”> 填好直播分类、房间标题 > 开始直播，然后会显示的串流密钥」
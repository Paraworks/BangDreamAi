# 完全网页端部署的轻量化AIvtuber 
```
#本机部署
git clone https://github.com/Paraworks/BangDreamAi
pip install -r requirements.txt
python app.py
```
## 配置live2d模型
BangDream的live2d可以直接从bestdori手动下载。Github上也有许多提取好的仓库
### [五团(卡面比较多)](https://github.com/seia-soto/BanG-Dream-Live2D)
### [七团](https://github.com/Eikanya/Live2d-model/tree/master/BanG%20Dream!)
### 你需要将这些模型放在[BangDreamAIFlask/static/Resources](https://github.com/Paraworks/BangDreamAi/tree/mainBangDreamAIFlask/static/Resources)下
## 启动TTS合成
[TTS(Bang dream Bert vits示例)](https://nijigaku.top/2023/10/03/BangDreamTTS/):
```
git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert
cd MyGO_VIts-bert
pip install -r requirements.txt
pip install Flask
pip install Flask-CORS
#把server.py替代为这个仓库的
python server.py
```
## 自定义chatbot
自行修改[chat.py](https://github.com/Paraworks/BangDreamAi/BangDreamAIFlask/utils/chat.py)的相关配置以及逻辑(如果需要)
## To do list
视觉小说模式(已完成大部分)
b站直播间AI直播
## OBS 配置详解：
#### live2d 配置
- 来源 > + > 浏览器 > 新建 > URL：填入上一步生成的live2d链接，一般是localhost:xxxx
#### [弹幕姬](https://chat.bilisc.com/)
- 来源 > + > 浏览器 > 新建 > URL：参照[说明](https://chat.bilisc.com/help)填入链接以及css
#### B 站推流配置
- (obs内)设置（Preferences）> 直播 > 服务 > 自定义 > 填写 bilibili服务器以及推流码...
- 推流码填写「B 站首页 > 头像 > 推荐服务 > 直播中心 > 左侧“我的直播间”> 填好直播分类、房间标题 > 开始直播，然后会显示的串流密钥」
# 开发
为了最大程度减轻部署难度，已经打包了live2d所需的npm模块，可以参考该分支以及[源码](https://github.com/Paraworks/BangDreamAi/blob/template/live2dDriver/src/components/index.js)
## 技术栈
Flask sqlite jinja2
## 项目结构
```
\---BangDreamAI
|   app.py
|   content.json
|   database_usecase.py
|   README.md
|   requirements.txt
|   task.json
|   user.json
|
\---BangDreamAIFlask
    |   __init__.py
    |
    +---controllers
    |       chat.py
    |       content.py
    |       display.py
    |       editor.py
    |       emotion.py
    |       file.py
    |       listModels.py
    |       sentence.py
    |       __init__.py
    |
    +---models
    |       config.py
    |       database.py
    |
    +---static
    |   +---assets
    |   |       style.css
    |   |
    |   +---components
    |   |       live2d.js
    |   |       script.js
    |   |
    |   +---library
    |   |       iconfont.js
    |   |       live2d.min.js
    |   |       live2dcubismcore.js
    |   |       live2dcubismcore.js.map
    |   |       live2dcubismcore.min.js
    |   |
    |   \---Resources
    |       +---001_2018_halloween
    |       |   |   model.json
    |       |   |
    |       |   \---live2d
    |       |           001_general_angry01.exp
    |                   ......
    |       |           001_live_event_47_ssr_wink01.mtn
    |       |           kasumi_2018halloween.moc
    |       |           kasumi_2018halloween.physics
    |       |           texture_00.png
    |       |
    |       +---001_school_summer
    |       |   |   model.json
    |       |   |
    |       |   \---live2d
    |       |           001_general_angry01.exp
    |                   ......
    |       |           001_live_event_47_ssr_wink01.mtn
    |       |           kasumi_school_summer.moc
    |       |           kasumi_school_summer.physics
    |       |           texture_00.png
    |       |
    |       \---002_2018_dog
    |           |   model.json
    |           |
    |           +---002_2018af_casual
    |           |   |   model.json
    |           |   |
    |           |   \---live2d
    |           |           002_general_angry01.mtn
    |                   ......
    |           |           002_general_tae_surprised.exp
    |           |           tae_2018af_casual.moc
    |           |           tae_2018af_casual.physics
    |           |           texture_00.png
    |           |
    |           \---live2d
    |                   002_general_angry01.mtn
    |                   ......
    |                   002_general_tae_surprised.exp
    |                   tae.physics
    |                   tae_2018dog_t03.moc
    |                   texture_00.png
    |
    +---templates
    |   +---front
    |   |       interface.html
    |   |
    |   \---live2d
    |           base.html
    |
    +---utils
    |       chat.py
    |       emotion.py
    |       tools.py
    |
    \---views
            index.py
            live2d.py
            __init__.py
```

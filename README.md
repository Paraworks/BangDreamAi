# 完全网页端部署的轻量化AIvtuber 
## live2d驱动部署
```
#编译部署
cd live2dDriver
npm install
# 本机测试
npm run dev
#编译部署(可以跳过)
npm run build
cd dist
#把live2dDriver/src文件夹拖到dist里面
http-server
```
## live2d模型
BangDream的live2d可以直接从bestdori手动下载。Github上也有许多提取好的仓库
### [五团(卡面比较多)](https://github.com/seia-soto/BanG-Dream-Live2D)
### [七团](https://github.com/Eikanya/Live2d-model/tree/master/BanG%20Dream!)
### 你需要将这些模型放在[live2dDriver/Resources](https://github.com/Paraworks/BangDreamAi/tree/main/live2dDriver/Resources)下，并且在启动网页界面或者修改[config.json](https://github.com/Paraworks/BangDreamAi/blob/main/live2dDriver/config.json)文件来加载
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
## 启动chatbot(默认chatgpt)
自行修改[chatgpt.py](https://github.com/Paraworks/BangDreamAi/blob/main/chatgpt.py)的相关配置以及逻辑(如果需要)
```
pip install Flask
pip install openai
python chatgpt.py
```
## 默认配置
见[config.json](https://github.com/Paraworks/BangDreamAi/blob/main/live2dDriver/config.json)
## 控制&网页部署(可在页面内更改模型配置)
```
cd liveStream
npm install 
node server.js
#会显示 面板运行在 http://localhost:3000  这就是编译部署下的控制&网页面板
```
# 直播间部署(未测试)
自行修改[OBS.py](https://github.com/Paraworks/BangDreamAi/blob/main/OBS.py)的相关配置以及逻辑(如果需要)
```
pip install bilibili-api-python
python OBS.py
```
## OBS 配置详解：
#### live2d 配置
- 来源 > + > 浏览器 > 新建 > URL：填入上一步生成的live2d链接，一般是localhost:xxxx
#### [弹幕姬](https://chat.bilisc.com/)
- 来源 > + > 浏览器 > 新建 > URL：参照说明(https://chat.bilisc.com/help)填入链接以及css
#### B 站推流配置
- (obs内)设置（Preferences）> 直播 > 服务 > 自定义 > 填写 bilibili服务器以及推流码...
- 推流码填写「B 站首页 > 头像 > 推荐服务 > 直播中心 > 左侧“我的直播间”> 填好直播分类、房间标题 > 开始直播，然后会显示的串流密钥」

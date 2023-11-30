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
## 切换为自定义模型
见[config.json](https://github.com/Paraworks/BangDreamAi/blob/main/live2dDriver/config.json)
## 前端框架启动(可在页面内更改模型配置)
```
cd liveStream
npm install 
node server.js
#编译部署
#还没试
```
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
## 添加chatbot
自行修改[chatbotAPI.js](https://github.com/Paraworks/BangDreamAi/blob/main/liveStream/chatbotAPI.js)

# 直播间部署(待更新)
```
python launcher.py
```
添加聊天机器人(以chatgpt为例)
```
#阅读 launcher.py 删除所有相关注释启动gpt
pip install openai
python launcher.py
```
## 直播间设置
部署弹幕监听和chatbot
阅读并且修改[chatgpt.py](https://github.com/Paraworks/BangDreamAi/blob/main/chatgpt.py)的配置
```
pip install bilibili-api-python
pip install Flask
pip install openai
python chatgpt.py
```
直播间的弹幕会被纪录下来，并且由chatgpt生成回复，可以先测试完再进入下一步
启动[launcher.py](https://github.com/Paraworks/BangDreamAi/blob/main/launcher.py)监听回复结果
```
python launcher.py
```
配置[TTS](https://nijigaku.top/2023/10/03/BangDreamTTS/):
```
git clone https://huggingface.co/spaces/Mahiruoshi/BangDream-Bert-VITS2
cd BangDream-Bert-VITS2
pip install -r requirements.txt
#pip install Flask
#pip install Flask-CORS
#将app.py替换成TTS-example.py的内容
python app.py
```
启动live2d。将[这个链接](https://gitee.com/liu_soon/live2d-pixi/tree/master/src/library)下的所有文件搬运到 live2d/src/library 下
阅读并修改 [live2d/src/components/index.js](https://github.com/Paraworks/BangDreamAi/blob/main/live2d/src/components/index.js)的代码
```
#编译
cd live2d
npm install
npm run dev
# 因为是本机，可以直接在obs浏览器中用localhost加载模型
npm run build
cd dist
#把live2d/src文件夹拖到dist里面
http-server
```
## OBS 配置详解：
#### live2d 配置
- 来源 > + > 浏览器 > 新建 > URL：填入上一步生成的live2d链接，一般是localhost:xxxx或者127.0.0.1:8080
#### [弹幕姬](https://chat.bilisc.com/)
- 来源 > + > 浏览器 > 新建 > URL：参照说明(https://chat.bilisc.com/help)填入链接以及css
#### B 站推流配置
- (obs内)设置（Preferences）> 直播 > 服务 > 自定义 > 填写 bilibili服务器以及推流码...
- 推流码填写「B 站首页 > 头像 > 推荐服务 > 直播中心 > 左侧“我的直播间”> 填好直播分类、房间标题 > 开始直播，然后会显示的串流密钥」

# 完全网页端部署的轻量化AIvtuber 
## 启动chatbot(默认chatgpt)
自行修改[chatgpt.py](https://github.com/Paraworks/BangDreamAi/blob/main/chatgpt.py)的相关配置以及逻辑(如果需要)
```
git clone git clone -b docker --single-branch https://github.com/Paraworks/BangDreamAi.git
cd BangDreamAi
pip install Flask
pip install openai
python chatgpt.py
```
## live2d驱动部署
```
#编译部署
cd live2dDriver
#编译部署，默认8081端口
http-server
```
## 启动TTS合成
```
git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert
cd MyGO_VIts-bert
pip install -r requirements.txt
pip install Flask
pip install Flask-CORS
#端口5000
python server.py
```
```
cd controller
npm install 
node server.js
#会显示 面板运行在 http://127.0.0.1:3000  这就是编译部署下的控制&网页面板
```
# 完全网页端部署的轻量化AIvtuber 
## live2d驱动部署
```
#编译部署
cd live2dDriver
npm install
# 本机测试,部署在5173端口
npm run dev
```
## 启动TTS合成
```
git clone https://huggingface.co/spaces/Mahiruoshi/MyGO_VIts-bert
cd MyGO_VIts-bert
pip install -r requirements.txt
pip install Flask
pip install Flask-CORS
python server.py
```
## 启动chatbot(默认chatgpt)
自行修改[chatgpt.py](https://github.com/Paraworks/BangDreamAi/blob/main/chatgpt.py)的相关配置以及逻辑(如果需要)
```
cd ..
pip install Flask
pip install openai
python chatgpt.py
```
```
cd controller
npm install 
node server.js
#会显示 面板运行在 http://127.0.0.1:3000  这就是编译部署下的控制&网页面板
```
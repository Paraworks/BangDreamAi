将[这个链接](https://gitee.com/liu_soon/live2d-pixi/tree/master/src/library)下的所有文件搬运到 live2d/src/library 下
阅读并修改 live2d/src/components/index.js的代码
```
cd live2d
npm install
npm run dev
#如果你希望服务器部署
npm run build
cd dist
http-server
```
chatbot示例:复读机:
```
cd ..
python launcher.py
```
[TTS(Bang dream Bert vits示例)](https://nijigaku.top/2023/10/03/BangDreamTTS/):
```
git clone https://huggingface.co/spaces/Mahiruoshi/BangDream-Bert-VITS2
cd BangDream-Bert-VITS2
pip install -r requirements.txt
#将app.py替换成TTS-example.py的内容
python app.py
```
前端
```
python app.py
```
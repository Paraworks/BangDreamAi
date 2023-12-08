from flask import Flask, jsonify, request
import requests
import json
import random

app = Flask(__name__)

# 加载配置
with open('../live2dDriver/config.json', 'r') as f:
    config = json.load(f)

live2d_model_path = config['modelPath'].replace('..', '../live2dDriver')
chatbot_api_url = config['chatbotApiUrl'] or 'http://127.0.0.1:8080/chat'

# 加载 Live2D 数据
with open(live2d_model_path, 'r') as f:
    live2d_data = json.load(f)

@app.route('/show', methods=['POST'])
def show():
    message = request.json.get('message')
    
    # 随机选择动作和表情
    motion = random.choice(list(live2d_data['motions'].keys()))
    expression = random.choice(live2d_data['expressions'])

    # 发送消息到 ChatGPT API
    chat_response = requests.post(chatbot_api_url, json={'message': message})
    chat_text = chat_response.text if chat_response.status_code == 200 else '回复失败'

    # 构建响应
    response = {
        'text': chat_text,
        'motion': motion,
        'expression': expression['name']
    }

    return jsonify(response)

if __name__ == '__main__':
    app.run(port=8081)  # 随便找一个端口

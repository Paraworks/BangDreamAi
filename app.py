from flask import Flask, jsonify, render_template, request
from flask_cors import CORS
import uuid
from chat import process_message
import os
import json
import random

port = 5000
app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'

configs = {}
responses = {}
latest_session_id = None  # 用于存储最新的 session_id

# 初始全局默认配置
default_config = {
    "modelPath": "../static/Resources/001_live_event_47_ssr/model.json",
    "ttsApiBaseUrl": "http://127.0.0.1:8000/?is_chat=false&speaker=香澄&",
    "frequence": 0.5,
    "volum": 70,
    "upper": 800
}

@app.route('/')
def index():
    global latest_session_id
    session_id = str(uuid.uuid4())
    latest_session_id = session_id
    # 使用全局默认配置初始化，但保持 textApiBaseUrl 唯一
    configs[session_id] = default_config.copy()
    configs[session_id]["textApiBaseUrl"] = f"http://localhost:{port}/response/{session_id}"
    return render_template('index.html', session_id=session_id)


@app.route('/config/<session_id>', methods=['GET', 'POST'])
def config(session_id):
    if request.method == 'POST':
        updated_config = request.json
        # 更新全局默认配置（除 textApiBaseUrl 外）
        for key, value in updated_config.items():
            if key != "textApiBaseUrl":
                default_config[key] = value
        # 更新当前 session 的配置
        configs[session_id].update(updated_config)
        return jsonify({"success": True})
    return jsonify(configs.get(session_id, {}))

@app.route('/response/<session_id>', methods=['GET'])
def response(session_id):
    return jsonify({"text": responses.get(session_id, "")})

@app.route('/chat/<session_id>', methods=['POST'])
def chat(session_id):
    data = request.json
    message = data.get('message')
    model_path = data.get('modelPath')
    motions, expressions = get_model_data(model_path)  # 获取模型的动作和表情

    # 聊天处理逻辑（例如，使用 process_message 函数）
    chat_response = process_message(message)

    # 随机选择一个动作和表情
    chosen_motion = random.choice(motions) if motions else None
    chosen_expression = random.choice(expressions) if expressions else None

    # 更新响应数据
    response_data = {
        "response": chat_response,
        "motion": chosen_motion,
        "expression": chosen_expression
    }
    responses[session_id] = response_data

    # 直接将 response_data 作为 jsonify 的参数
    return jsonify(response=response_data)


def get_model_data(model_path):
    """读取模型文件并返回动作和表情列表"""
    try:
        with open(model_path, 'r') as file:
            model_data = json.load(file)
            motions = list(model_data.get('motions', {}).keys())
            expressions = [exp['name'] for exp in model_data.get('expressions', [])]
            return motions, expressions
    except Exception as e:
        print(f"Error reading model file: {e}")
        return [], []

@app.route('/get-temp-config', methods=['GET'])
def get_temp_config():
    if latest_session_id:
        return jsonify({"configurl": f"http://localhost:{port}/config/{latest_session_id}"})
    else:
        return jsonify({"error": "No session ID available"})

@app.route('/listModels')
def list_models():
    model_dir = 'static/Resources'  # 模型所在目录
    model_paths = []  # 存储模型路径的列表

    # 遍历模型目录
    for root, dirs, files in os.walk(model_dir):
        for file in files:
            if file.endswith('.json'):  # 假设模型文件以 .json 结尾
                path = os.path.join(root, file)
                model_paths.append(path)

    return jsonify(model_paths)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)

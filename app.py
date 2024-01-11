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

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)

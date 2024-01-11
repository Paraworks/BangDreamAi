from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.utils.chat import process_message
from BangDreamAIFlask.utils.emotion import emotion_classifier
import json

session_id = 'test'


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

@controllers.route('/chat/<session_id>', methods=['POST'])
def chat(session_id):
    db = app.config['db']
    data = request.json
    message = data.get('message')
    model_path = data.get('modelPath')
    motions, expressions = get_model_data(model_path)  # 获取模型的动作和表情

    # 聊天处理逻辑（例如，使用 process_message 函数）
    chat_response = process_message(message)

    # 随机选择一个动作和表情
    emotion, motion, expression = emotion_classifier(chat_response, motions, expressions)
    # 更新响应数据
    response_data = {
        "response": chat_response,
        "motion": motion,
        "expression": expression
    }
    db.insert(session_id, "text", response_data)

    # 直接将 response_data 作为 jsonify 的参数
    return jsonify(response=response_data)

@controllers.route('/storyteller/<session_id>', methods=['POST'])
def storyteller(session_id):
    #To do
    return jsonify(response=response_data)
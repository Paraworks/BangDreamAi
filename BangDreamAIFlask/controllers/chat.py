from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.utils.chat import process_message
from BangDreamAIFlask.utils.emotion import emotion_classifier,get_model_data
from BangDreamAIFlask.models.database import  Content
import json

@controllers.route('/chat/<session_id>', methods=['POST'])
def chat(session_id):
    db = app.config['db']
    sentence = db.find(Content, {"sessionID": session_id,"taskID": "init", "sentenceId": 1 })
    data = request.json
    message = data.get('message')
    model_path = data.get('modelPath')
    chat_response = process_message(message)
    motions, expressions = get_model_data(model_path)
    emotion, motion, expression = emotion_classifier(message, motions, expressions)
    response_data = {
        "expression": expression,
        "motion": motion,
        "response": chat_response
    }
    sentence["text"] = response_data
    print(sentence)
    db.update(Content, {"sessionID": session_id,"taskID": "init", "sentenceId": 1 }, sentence)

    # 直接将 response_data 作为 jsonify 的参数
    return jsonify(response=response_data)
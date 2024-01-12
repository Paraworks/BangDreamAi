from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.utils.chat import process_message
import json

@controllers.route('/chat/<session_id>', methods=['POST'])
def chat(session_id):
    db = app.config['db']
    sentence = db.find("content", {"sessionID": session_id,"storyID": "init", "sentenceId": 1 })
    data = request.json
    message = data.get('message')
    model_path = data.get('modelPath')
    chat_response = process_message(message)
    emotion, motion, expression = request.post('api/emotion',json={"message":chat_response,"modelPath":model_path})
    response_data = {
        "expression": expression,
        "motion": motion,
        "response": chat_response
    }
    sentence["text"] = response_data
    print(sentence)
    db.update('sentence', {"sessionID": session_id}, sentence)

    # 直接将 response_data 作为 jsonify 的参数
    return jsonify(response=response_data)
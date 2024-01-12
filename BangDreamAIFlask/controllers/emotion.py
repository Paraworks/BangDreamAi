from flask import  jsonify, request
from . import controllers
from BangDreamAIFlask.utils.emotion import emotion_classifier,get_model_data

@controllers.route('/emotion', methods=['POST'])
def emotion():
    data = request.json
    message = data.get('message')
    model_path = data.get('modelPath')
    motions, expressions = get_model_data(model_path)
    emotion, motion, expression = emotion_classifier(message, motions, expressions)
    return jsonify(emotion=emotion, motion=motion, expression=expression)
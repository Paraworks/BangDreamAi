from flask import  jsonify, request
from . import controllers
from flask import current_app as app
from BangDreamAIFlask.models.database import Content
@controllers.route('/sentence/<session_id>', methods=['GET'])
def response(session_id):
    db = app.config['db']
    response = db.find(Content, {"sessionID": session_id,"taskID": "init", "sentenceId": 1 })
    return response
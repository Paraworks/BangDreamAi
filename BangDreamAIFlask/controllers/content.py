from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.models.database import  Content
@controllers.route('/content/<session_id>/<task_id>/<sentence_id>', methods=['GET', 'POST'])
def content(session_id,task_id,sentence_id):
    db = app.config['db']
    if request.method == 'POST':
        updated_config = request.json 
        if db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence_id}):
            db.update(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence_id}, updated_config)
        else:
            db.insert(Content, updated_config)
        db.update(Content, {"sessionID": session_id}, updated_config)
        return jsonify({"success": True})
    configs = db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence_id})
    return configs
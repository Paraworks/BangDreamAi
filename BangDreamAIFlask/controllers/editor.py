from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.models.database import Content, Task

@controllers.route('/editor/<session_id>/<task_id>', methods=['POST','GET'])
def editor(session_id,task_id):
    db = app.config['db']
    if request.method == 'POST':
        updateboard = request.json
        if db.find(Task, {"sessionID": session_id, "taskID": task_id}):
            db.update(Task, {"sessionID": session_id, "taskID": task_id}, updateboard)
        else:
            db.insert(Task, updateboard)
        return jsonify({"success": True})
    if db.find(Task, {"sessionID": session_id, "taskID": task_id}):
        task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
        return task
    return jsonify({"success": False})

'''
@controllers.route('/create/<session_id>/<task_id>/<sentence_id>', methods=['GET'])
def create(session_id,task_id,sentence_id):
    db = app.config['db']
    if db.find(Task, {"sessionID": session_id, "taskID": task_id}):
        if db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence_id}):
            return jsonify({"Already created!!!": False})
        task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
        task['contents']['sentence_'+sentence_id] = sentence_id
        db.update(Task, {"sessionID": session_id, "taskID": task_id}, task)
        updated_content = db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": int(sentence_id)-1})
        updated_content['sentenceId'] = sentence_id
        #删除id key
        del updated_content['id']
        db.insert(Content, updated_content)
        task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
        return task
    db.insert(Task, {"sessionID": session_id, "taskID": task_id, "contents": {"sentence_1": 1}})
    updated_content = db.find(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1})
    updated_content['taskID'] = task_id
    del updated_content['id']
    db.insert(Content, updated_content)
    task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
    return task
'''
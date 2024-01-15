from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.models.database import Content, Task

@controllers.route('/editor/<session_id>/<task_id>', methods=['GET', 'POST'])
def editor(session_id,task_id):
    db = app.config['db']
    if request.method == 'POST':
        updateboard = request.json
        updated_task = updateboard['task']
        if db.find(Task, {"sessionID": session_id, "taskID": task_id}):
            db.update(Task, {"sessionID": session_id, "taskID": task_id}, updated_task)
        else:
            db.insert(Task, updated_task)
        for sentence in updateboard['contents']:
            updated_content = updateboard['contents'][sentence]
            if db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": updated_content['sentenceId']}):
                db.update(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": updated_content['sentenceId']}, updated_content)
            else:
                db.insert(Content, updated_content)
        return jsonify({"success": True})
    task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
    editboard = {}
    editboard['task'] = task
    editboard['contents'] = {}
    for sentence in task['contents']:
        sentence_name = "sentence_"+str(task['contents'][sentence])
        editboard['contents'][sentence_name] = db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": task['contents'][sentence] })
    return editboard

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
        return jsonify({"success": True})
    db.insert(Task, {"sessionID": session_id, "taskID": task_id, "contents": {"sentence_1": 1}})
    updated_content = db.find(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1})
    updated_content['taskID'] = task_id
    del updated_content['id']
    db.insert(Content, updated_content)
    return jsonify({"success": True})
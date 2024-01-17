from flask import  jsonify, request
from . import controllers
from flask import current_app as app
from BangDreamAIFlask.models.database import Content, Task
import time

@controllers.route('/display/<session_id>/<task_id>', methods=['GET'])
def display(session_id,task_id):
    db = app.config['db']
    task = db.find(Task, {"sessionID": session_id, "taskID": task_id})
    for sentence in task['contents']:
        content = db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": task['contents'][sentence] })
        del content['id'], content['sessionID'], content['taskID'], content['sentenceId']
        #if content['isPlay'] == 1:
        db.update(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1 }, content)
        stop = content['duration']
        time.sleep(stop)
    return jsonify({"success": True})
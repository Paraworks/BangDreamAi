from flask import  jsonify, request
from . import controllers
from flask import current_app as app
from BangDreamAIFlask.models.database import Content, Task
import time

@controllers.route('/display/<session_id>/<task_id>', methods=['POST'])
def display(session_id,task_id):
    db = app.config['db']
    task = request.json
    for sentence_id, content in task['contents'].items():
        if db.find(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1 }):
            del content['sentenceId']
            del content['taskID']
            db.update(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1 }, content)
            duration = int(content['duration'])
            time.sleep(duration)
            test = db.find(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1 })
            print(test)
        else:
            content['sentenceId'] = 1
            content['taskID'] = "init"
            duration = int(content['duration'])
            time.sleep(duration)
            db.insert(Content, content)
            test = db.find(Content, {"sessionID": session_id, "taskID": "init", "sentenceId": 1 })
            print(test)
    return jsonify({"success": True})

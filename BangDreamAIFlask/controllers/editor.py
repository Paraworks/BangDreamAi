from flask import  jsonify, request
from flask import current_app as app
from . import controllers
from BangDreamAIFlask.models.database import Content, Task

@controllers.route('/editor/<session_id>/<task_id>', methods=['GET', 'POST'])
def editor(session_id,task_id):
    db = app.config['db']
    if request.method == 'POST':
        story = request.json
        for sentence in story['sentences']:
            if db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence['sentenceId']}):
                db.update(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": sentence['sentenceId']}, sentence)
            else:
                db.insert(Content, sentence)
        task = story['task']
        if db.find(Task, {"sessionID": session_id, "taskID": task_id}):
            db.update(Task, {"sessionID": session_id, "taskID": task_id}, task)
        else:
            db.insert(Task, task)
    story = {}
    print(story)
    story['task'] = db.find(Task, {"sessionID": session_id, "taskID": task_id})
    for key in story['task']['contents']:
        story['sentences'] = db.find(Content, {"sessionID": session_id, "taskID": task_id, "sentenceId": key})
    return story
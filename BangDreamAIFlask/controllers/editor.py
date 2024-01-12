from flask import  jsonify, request
from flask import current_app as app
from . import controllers

@controllers.route('/editor/<session_id>/<story_id>', methods=['GET', 'POST'])
def editor(session_id,story_id):
    db = app.config['db']
    if request.method == 'POST':
        story = request.json
        for sentence in story['sentences']:
            if db.find('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": sentence['sentenceId']}):
                db.update('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": sentence['sentenceId']}, sentence)
            else:
                db.insert('content', sentence)
        task = story['task']
        if db.find('task', {"sessionID": session_id, "storyID": story_id}):
            db.update('task', {"sessionID": session_id, "storyID": story_id}, task)
        else:
            db.insert('task', task)
    story = {}
    story['task'] = db.find('task', {"sessionID": session_id, "storyID": story_id})
    for key in story['task']['contents']:
        story['sentences'] = db.find('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": key})
    return story
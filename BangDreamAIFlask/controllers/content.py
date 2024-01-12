from flask import  jsonify, request
from flask import current_app as app
from . import controllers

@controllers.route('/content/<session_id>/<story_id>/<sentence_id>', methods=['GET', 'POST'])
def content(session_id,story_id,sentence_id):
    db = app.config['db']
    if request.method == 'POST':
        updated_config = request.json
        if db.find('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": sentence_id}):
            db.update('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": sentence_id}, updated_config)
        else:
            db.insert('content', updated_config)
        return jsonify({"success": True})
    configs = db.find('content', {"sessionID": session_id, "storyID": story_id, "sentenceId": sentence_id})
    return configs
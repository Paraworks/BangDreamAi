from flask import render_template
from . import views

@views.route('/<session_id>/<task_id>')
def story(session_id,task_id):
    return render_template('live2d/story.html', session_id=session_id,task_id=task_id)
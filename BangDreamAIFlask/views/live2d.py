from flask import render_template
from . import views

@views.route('/<session_id>')
def live2d(session_id):
    return render_template('live2d/base.html')
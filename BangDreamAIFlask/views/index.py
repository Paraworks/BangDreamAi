from flask import render_template
from flask import current_app as app
from . import views
import uuid
from BangDreamAIFlask.models.database import Database, Content, Task, User
from BangDreamAIFlask.models.config import Config
latest_session_id = None 

@views.route('/')
def index():
    global latest_session_id
    db = app.config['db']
    session_id = str(uuid.uuid4())
    latest_session_id = session_id
    content = Config('content.json').read()
    task = Config('task.json').read()
    user = Config('user.json').read()
    if not db.find(Task, {'sessionID': session_id,"taskID": 'init'}):
        content['sessionID'] = session_id
        task['sessionID'] = session_id
        user['sessionID'] = session_id
        db.insert(Content, content)
        db.insert(Task, task)
        db.insert(User, user)
    return render_template('front/interface.html', session_id=session_id)
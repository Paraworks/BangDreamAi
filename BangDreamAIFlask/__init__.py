from flask import Flask
from flask_cors import CORS
from BangDreamAIFlask.models.database import Database, Content, Task, User
from BangDreamAIFlask.models.config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)
    with app.app_context():
        db = Database(app)
        content = Config('content.json').read()
        task = Config('task.json').read()
        user = Config('user.json').read()
        db.insert(Content, content)
        db.insert(Task, task)
        db.insert(User, user)
        
    # 注册蓝图
    from .views import views

    app.register_blueprint(views, url_prefix='/')

    from .controllers import controllers

    app.register_blueprint(controllers, url_prefix='/api')

    # 将 db 添加到 app 的配置中，以便在其他地方使用
    app.config['db'] = db

    return app
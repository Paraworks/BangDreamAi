from flask import Flask
from flask_cors import CORS
from BangDreamAIFlask.models.database import Database
from BangDreamAIFlask.models.config import Config

def create_app():
    app = Flask(__name__)
    CORS(app)
    with app.app_context():
        db = Database(app)
        db.create_table('content', Config('content.json').read())
        db.create_table('sentence', Config('content.json').read())
        db.create_table('task', Config('task.json').read())
        db.create_table('user', Config('user.json').read())
        db.insert('content', Config('content.json').read())
        db.insert('sentence', Config('content.json').read())
        db.insert('task', Config('task.json').read())
        db.insert('user', Config('user.json').read())
            
    # 注册蓝图
    from .views import views

    app.register_blueprint(views, url_prefix='/')

    from .controllers import controllers

    app.register_blueprint(controllers, url_prefix='/api')

    # 将 db 添加到 app 的配置中，以便在其他地方使用
    app.config['db'] = db

    return app
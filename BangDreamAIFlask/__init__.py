from flask import Flask


def create_app():
    app = Flask(__name__)

    # 注册蓝图
    from .views import views

    app.register_blueprint(views, url_prefix='/')

    from .controllers import controllers

    app.register_blueprint(controllers, url_prefix='/api')

    return app
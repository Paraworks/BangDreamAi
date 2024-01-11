from flask import  jsonify, request
from flask import current_app as app
from . import controllers

session_id = 'test'

@controllers.route('/content/<session_id>', methods=['GET', 'POST'])
def config(session_id):
    db = app.config['db']
    if request.method == 'POST':
        updated_config = request.json
        # 更新全局默认配置（除 textApiBaseUrl 外）
        for key, value in updated_config.items():
            if key != "textApiBaseUrl":
                db.update('test', key, value)
        return jsonify({"success": True})
    configs = db.get_all(session_id)
    return jsonify(configs)
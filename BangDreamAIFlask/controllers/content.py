from flask import  jsonify, request
from . import controllers

@controllers.route('/config/<session_id>', methods=['GET', 'POST'])
def config(session_id):
    if request.method == 'POST':
        updated_config = request.json
        # 更新全局默认配置（除 textApiBaseUrl 外）
        for key, value in updated_config.items():
            if key != "textApiBaseUrl":
                default_config[key] = value
        # 更新当前 session 的配置
        configs[session_id].update(updated_config)
        return jsonify({"success": True})
    return jsonify(configs.get(session_id, {}))
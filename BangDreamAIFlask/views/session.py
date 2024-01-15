from flask import  jsonify
from . import views

# 假设使用test作为用户名
session_id = 'test'

@views.route('/get-temp-config', methods=['GET'])
def get_temp_config():
    if session_id:
        return jsonify({"configurl": f"http://localhost:5000/api/content/{session_id}/init/1"})
    else:
        return jsonify({"error": "No session ID available"})


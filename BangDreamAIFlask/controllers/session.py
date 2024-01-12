from flask import  jsonify
from . import controllers

# 假设使用test作为用户名
session_id = 'test'

@controllers.route('/get-temp-config', methods=['GET'])
def get_temp_config():
    if session_id:
        return jsonify({"configurl": f"http://localhost:5000/api/sentence/{session_id}"})
    else:
        return jsonify({"error": "No session ID available"})


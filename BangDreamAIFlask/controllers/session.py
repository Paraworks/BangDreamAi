from flask import  jsonify
from . import controllers

@controllers.route('/get-temp-config', methods=['GET'])
def get_temp_config():
    if latest_session_id:
        return jsonify({"configurl": f"http://localhost:{port}/config/{latest_session_id}"})
    else:
        return jsonify({"error": "No session ID available"})


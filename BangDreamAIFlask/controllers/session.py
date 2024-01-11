from flask import  jsonify
from . import controllers

session_id = 'test'

@controllers.route('/get-temp-config', methods=['GET'])
def get_temp_config():
    if session_id:
        return jsonify({"configurl": f"http://localhost:5000/content/{session_id}"})
    else:
        return jsonify({"error": "No session ID available"})


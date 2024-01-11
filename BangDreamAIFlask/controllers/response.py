from flask import  jsonify, request
from . import controllers

@controllers.route('/response/<session_id>', methods=['GET'])
def response(session_id):
    return jsonify({"text": responses.get(session_id, "")})
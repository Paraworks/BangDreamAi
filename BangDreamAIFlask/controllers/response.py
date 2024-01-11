from flask import  jsonify, request
from . import controllers
from flask import current_app as app

session_id = 'test'

@controllers.route('/response/<session_id>', methods=['GET'])
def response(session_id):
    db = app.config['db']
    response = db.read(session_id, "text")
    return jsonify({"text": response})
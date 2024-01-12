from flask import  jsonify, request
from . import controllers
from flask import current_app as app

@controllers.route('/sentence/<session_id>', methods=['GET'])
def response(session_id):
    db = app.config['db']
    response = db.find('sentence', {"sessionID": session_id})
    return response
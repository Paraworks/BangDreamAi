from flask import Flask, request, jsonify
from BangDreamAIFlask.models.database import Database
from BangDreamAIFlask.models.config import Config

port = 5001
app = Flask(__name__)

with app.app_context():
    db = Database(app)
    db.create_table('test')

    for key, value in Config('config.json').__dict__.items():
        db.insert('test', key, value)
    for key, value in Config('config.json').__dict__.items():
        print(key, db.read('test', key))

@app.teardown_appcontext
def close_connection(exception):
    if db is not None:
        db.close()

@app.route('/config/', methods=['GET', 'POST'])
def config():
    json = {}
    if request.method == 'POST':
        for key, value in request.form.items():
            db.update('test', key, value)
    for key in Config('config.json').__dict__.keys():
        json[key] = db.read('test', key)
    return jsonify(json)
        

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)
from flask import Flask, request, jsonify
from BangDreamAIFlask.models.database import Database
from BangDreamAIFlask.models.config import Config

port = 5001
app = Flask(__name__)

with app.app_context():
    db = Database(app)
    db.create_table('content', Config('content.json').read())
    db.create_table('sentence', Config('sentence.json').read())
    db.create_table('task', Config('task.json').read())
    db.create_table('user', Config('user.json').read())
    db.insert('content', Config('content.json').read())
    db.insert('sentence', Config('sentence.json').read())
    db.insert('task', Config('task.json').read())
    db.insert('user', Config('user.json').read())
    # 测试 CRUD 操作
    # 查找一个句子
    find_criteria = {"sessionID": "test", "storyID": "user_story_001", "sentenceId": 1}
    found_sentence = db.find('content', find_criteria)
    print("Found Sentence:", found_sentence)

    # 更新一个句子
    update_data = {"modelPath": "../static/new_model.json"}
    db.update('content', find_criteria, update_data)
    updated_sentence = db.find('content', find_criteria)
    print("Updated Sentence:", updated_sentence)

    # 删除一个任务
    delete_criteria = {"sessionID": "test", "storyID": "user_story_001"}
    db.delete('task', delete_criteria)
    deleted_task = db.find('task', delete_criteria)
    print("Deleted Task:", deleted_task)

@app.teardown_appcontext
def close_connection(exception):
    if db is not None:
        db.close()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)
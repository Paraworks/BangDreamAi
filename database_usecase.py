from flask import Flask
from BangDreamAIFlask.models.database import Database, Content
from BangDreamAIFlask.models.config import Config
port = 5001
app = Flask(__name__)
db = Database(app)

with app.app_context():
    # 假设 Config('content.json').read() 返回一个字典
    content_data = {
    "sessionID": "test",
    "storyID": "init",
    "sentenceId": 1,
    "modelPath": "../static/Resources/001_2018_halloween/model.json",
    "ttsApiBaseUrl": "http://127.0.0.1:8000/?is_chat=false&speaker=香澄&",
    "textApiBaseUrl": "http://127.0.0.1:5000/api/sentence/test",
    "text": {
        "expression": "001_2018_halloween_01",
        "motion": "001_2018_halloween_01",
        "response": "初始化成功"
      },
    "frequence": 0.5,
    "volume": 70,
    "background": "114.png",
    "speaker": "香澄",
    "band": "PoppinParty",
    "position": "right"
  }

    # 测试 CRUD 操作
    # 查找一个句子
    find_criteria = {"sessionID": "test", "storyID": "init", "sentenceId": 1}
    found_sentence = db.find(Content, find_criteria)
    print("Found Sentence:", found_sentence)

    # 更新一个句子
    update_data = {"modelPath": "../static/new_model.json"}
    db.update(Content, find_criteria, update_data)
    updated_sentence = db.find(Content, find_criteria)
    print("Updated Sentence:", updated_sentence)

    # 删除一个任务
    delete_criteria = {"sessionID": "test", "storyID": "user_story_001"}
    db.delete(Content, delete_criteria)
    deleted_task = db.find(Content, delete_criteria)
    print("Deleted Task:", deleted_task)

@app.teardown_appcontext
def close_connection(exception):
    db.db.session.remove()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port, debug=True)

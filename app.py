from flask_cors import CORS
from flask import Flask, request, jsonify, render_template
from load import get_band_list
from chat import handle_chat
import json

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        data = request.json
        action = data.get('action')
        if action == 'listModels':
            return jsonify(get_band_list())
        elif action == 'getContent':
            with open('config.json', 'r', encoding='utf-8') as file:
                config = json.load(file)
            return jsonify(config)
        elif action == 'updateContent':
            config = data.get('data')
            with open('config.json', 'w', encoding='utf-8') as file:
                json.dump(config, file, ensure_ascii=False, indent=4)
            return jsonify({'status': 'success'})
        elif action == 'chat':
            chat_data = data.get('data')
            return handle_chat(chat_data)
        else:
            return jsonify({'error': 'Invalid action'}), 400
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

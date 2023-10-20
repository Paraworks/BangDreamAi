from flask import Flask, Response, request

import time
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
FILE_PATH = "read.txt"
last_text = ""

@app.route('/show', methods=['GET'])
def show_text():
    global last_text
    with open(FILE_PATH, 'r', encoding='utf-8') as f:
        current_text = f.read().strip()
        if current_text != last_text:
            last_text = current_text
    # 直接返回utf-8编码的字符串
    return Response(last_text, content_type='text/plain; charset=utf-8')

@app.route('/mailbox', methods=['POST'])
def save_text():
    text_content = request.form.get('text')
    if text_content:
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(text_content)
        return "Text saved successfully!"
    else:
        return "Text not provided!", 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5180)

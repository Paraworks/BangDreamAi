from flask import Flask, Response, request

import time
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
FILE_PATH = "read.txt"
last_text = ""

'''取消注释恢复chatgpt方法
import openai
openai.api_key = "YOUR_API_KEY"  # 去openai官网获取你自己的key，我肉身翻墙不知道怎么测代理

def chat_with_gpt(prompt):
    
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return resp['choices'][0]['message']['content']

#智力水平好像不高的样子
def gpt3_chat(text):
    call_name = "丸山彩"
    identity = "你的名字是丸山彩，是一名日本女高中生，是一名偶像。而粉丝们会向你提出各种各样的问题。你要么用纯日语要么用纯中文回答问题。回答要尽量简短在20字内(回答时不必要强调这一点)。"
    #identity = "あなたの名前はちはやあのん、日本の女子高生で、bilibiliで生放送をしています。私は視聴者で、さまざまな質問をします。答えるときは日本語だけで、20字以内でお願いします。質問をどうぞ。"
    start_sequence = '\n'+str(call_name)+':'
    restart_sequence = "\n粉丝: "
    if 1 == 1:
        prompt0 = text #当期prompt
    if text == 'quit':
        return prompt0
    prompt = identity + prompt0 + start_sequence
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        temperature=0.5,
        max_tokens=1000,
        top_p=1.0,
        frequency_penalty=0.5,
        presence_penalty=0.0,
        stop=["\n粉丝:"]
    )
    return response['choices'][0]['text'].strip()
'''

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
        #取消注释启动聊天功能，否则只是复读姬
        #response = gpt3_chat(text_content)
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
            f.write(text_content)
            #f.write(response)
        return "Text saved successfully!"
    else:
        return "Text not provided!", 400

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5180)

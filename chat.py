import openai
import random
import json
import requests
from flask import jsonify
from load import get_model_data
import urllib.parse

def emotion_classifier(text, motions, expressions):
    motion = random.choice(motions) if motions else None
    expression = random.choice(expressions) if expressions else None
    emotion = text
    return emotion, motion, expression

def qingyunke(msg):
    url = f'http://api.qingyunke.com/api.php?key=free&appid=0&msg={urllib.parse.quote(msg)}'
    html = requests.get(url)
    return html.json()["content"]

def japanese_bot(msg):
    # 假设这个函数调用一个免费的日语聊天机器人API，并返回响应文本
    # 需要根据实际情况实现这个函数
    url = f'http://example.com/api?text={urllib.parse.quote(msg)}'
    html = requests.get(url)
    return html.json()["response"]

def handle_chat(chat_data):
    message = chat_data.get('message')
    config = chat_data.get('config')
    
    model_path = config.get('modelPath')
    api_key = config.get('apiKey')
    api_link = config.get('apiLink')
    api = config.get('api')
    
    try:
        if api == 'chatgpt':
            openai.api_key = api_key
            response = openai.ChatCompletion.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": message}
                ]
            )
            reply = response['choices'][0]['message']['content']
        else:
            response = requests.post(api_link, json={"text": message, "apiKey": api_key})
            reply = response.json().get('response', '无法获取响应')
    except:
        reply = qingyunke(message)
    
    motions, expressions = get_model_data(model_path)
    emotion, motion, expression = emotion_classifier(reply, motions, expressions)
    
    # 保存回复到config中
    with open('config.json', 'r+', encoding='utf-8') as file:
        config_data = json.load(file)
        config_data['text'] = {'response': reply, 'expression': expression, 'motion': motion}
        file.seek(0)
        json.dump(config_data, file, ensure_ascii=False, indent=4)
        file.truncate()
    
    return jsonify({'response': {'response': reply, 'motion': motion, 'expression': expression}})

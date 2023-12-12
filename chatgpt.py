from flask import Flask, request, jsonify
import openai
import random
import requests
import urllib.parse

app = Flask(__name__)

openai.api_key = 'YOUR_API_KEY'

def qingyunke(msg):
    url = f'http://api.qingyunke.com/api.php?key=free&appid=0&msg={urllib.parse.quote(msg)}'
    html = requests.get(url)
    return html.json()["content"]

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    user_message = data['message']
    motions = data['motions']
    expressions = data['expressions']

    try:
        # 使用 OpenAI API 获取回复
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )

        # 随机选择一个 motion 和 expression
        chosen_motion = random.choice(motions)
        chosen_expression = random.choice(expressions)

        return jsonify({
            'text': response.choices[0].message['content'],
            'motion': chosen_motion,
            'expression': chosen_expression
        })
    except Exception as e:
        print('Error:', e)
        # 调用青云客 API 作为替代方案
        fallback_response = qingyunke(user_message)
        return jsonify({
            'text': fallback_response,
            'motion': random.choice(motions),
            'expression': random.choice(expressions),
            'error': str(e)
        })

if __name__ == '__main__':
    app.run(port=8080)

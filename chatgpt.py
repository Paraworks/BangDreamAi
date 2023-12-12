from flask import Flask, request, jsonify
import openai
import random

app = Flask(__name__)

openai.api_key = 'YOUR_API_KEY'

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
        return jsonify({'text': 'chatgpt failed to response:'+user_message, 'error': str(e)})

if __name__ == '__main__':
    app.run(port=8080)

from flask import Flask, request, jsonify
import openai

app = Flask(__name__)

# 将 YOUR_API_KEY 替换为您的 OpenAI API 密钥
openai.api_key = 'YOUR_API_KEY'

@app.route('/chat', methods=['POST'])
def chat():
    user_message = request.json.get('message')
    
    try:
        # 使用 OpenAI API 获取 GPT-3.5 的回复
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": user_message}
            ]
        )
        return jsonify({'response': response.choices[0].message['content']})
    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(port=8080)

from bilibili_api import live, sync, Credential
import openai
import time
import threading
import re
FILE_PATH = "read.txt"
openai.api_key = "YOUR_API_KEY"  # 去openai官网获取你自己的key，我肉身翻墙不知道怎么测代理

# Bilibili房间设置，参考 https://www.bilibili.com/read/cv12349604/ 
cred = Credential(
    sessdata = '',
    buvid3= '',
)

room_id = "你的哔哩哔哩直播房间号"
room = live.LiveDanmaku(room_id, credential=cred)

def chat_with_gpt(prompt):
    
    resp = openai.ChatCompletion.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return resp['choices'][0]['message']['content']

def gpt3_chat(text):
    call_name = "真白"
    identity = "你的名字是真白，是一名日本女高中生，是一名偶像。而粉丝们会向你提出各种各样的问题。回答要尽量简短在20字内，你只要简短地重复问题并且给出回答就好，不需要强调自己的身份。"
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

@room.on('DANMU_MSG')
async def on_danmaku(event):
    # 收到弹幕
    msg = event["data"]["info"][1]
    
    # 删除弹幕中的特殊符号
    msg_cleaned = re.sub(r'\[.*?\]', '', msg)
    
    print("记录:" + msg_cleaned)

    # 检查弹幕长度
    if len(msg_cleaned) <= 3:
        return

    # 检查弹幕是否包含英文或阿拉伯数字
    if re.search(r'[a-zA-Z0-9]', msg_cleaned):
        return

    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(f"{{{msg_cleaned}}}\n")

@room.on('SEND_GIFT')
async def on_gift(event):
    if event['type'] == 'SEND_GIFT':
        uname = event['data']['data']['receive_user_info']['uname']
        thank_msg = f"感谢{uname}的舰长"
        print("记录:"+thank_msg)
        with open(FILE_PATH, 'w', encoding='utf-8') as f:
           f.write(thank_msg + "\n")

def process_messages():
    last_processed_msg = None
    while True:
        with open(FILE_PATH, 'r+', encoding='utf-8') as f:
            content = f.read().strip()
            if content.startswith("{") and content.endswith("}"):
                msg = content[1:-1]
                if msg != last_processed_msg:
                    print("弹幕:" + msg)
                    response = gpt3_chat(msg)
                    print("回复:" + response)
                    f.seek(0)
                    f.write(response)
                    f.truncate()
                    last_processed_msg = response
                else:
                    print("没有新弹幕，忽视...")
        time.sleep(5)

threading.Thread(target=process_messages, daemon=True).start()

sync(room.connect())

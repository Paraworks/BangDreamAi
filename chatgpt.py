from bilibili_api import live, sync, Credential
import openai
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



@room.on('DANMU_MSG')
async def on_danmaku(event):
    # 收到弹幕
    # print(event)
    msg = event["data"]["info"][1]
    print(msg)
    # 用gpt3.5 需要自行修改
    # response = chat_with_gpt(msg)
    response = gpt3_chat(msg)
    print(response)
    with open(FILE_PATH, 'w', encoding='utf-8') as f:
        f.write(response)

#同理自己diy怎么回应送礼物以及进入直播间等事件
@room.on('SEND_GIFT')
async def on_gift(event):
    # 收到礼物
    print(event)

sync(room.connect())

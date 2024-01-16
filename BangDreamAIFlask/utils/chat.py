# chat.py
import requests
import urllib.parse

def qingyunke(msg):
    url = f'http://api.qingyunke.com/api.php?key=free&appid=0&msg={urllib.parse.quote(msg)}'
    html = requests.get(url)
    return html.json()["content"]

def process_message(message):
    # 简单的复述逻辑或其他聊天逻辑
    response = qingyunke(message)
    return response
from flask import Flask, request, jsonify
from flask_cors import CORS
import logging
logging.getLogger("numba").setLevel(logging.WARNING)
logging.getLogger("markdown_it").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("matplotlib").setLevel(logging.WARNING)

logging.basicConfig(
    level=logging.INFO, format="| %(name)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)
import datetime
import numpy as np
import torch
from ebooklib import epub
import PyPDF2
from PyPDF2 import PdfReader
import zipfile
import shutil
import sys, os
import json
from bs4 import BeautifulSoup
import argparse
import commons
import utils
from models import SynthesizerTrn
from text.symbols import symbols
from text import cleaned_text_to_sequence, get_bert
from text.cleaner import clean_text
import gradio as gr
import webbrowser
import re
from scipy.io.wavfile import write

net_g = None

if sys.platform == "darwin" and torch.backends.mps.is_available():
    device = "mps"
    os.environ["PYTORCH_ENABLE_MPS_FALLBACK"] = "1"
else:
    device = "cuda"

def is_japanese(string):
        for ch in string:
            if ord(ch) > 0x3040 and ord(ch) < 0x30FF:
                return True
        return False

def get_text(text, language_str, hps):
    norm_text, phone, tone, word2ph = clean_text(text, language_str)
    phone, tone, language = cleaned_text_to_sequence(phone, tone, language_str)

    if hps.data.add_blank:
        phone = commons.intersperse(phone, 0)
        tone = commons.intersperse(tone, 0)
        language = commons.intersperse(language, 0)
        for i in range(len(word2ph)):
            word2ph[i] = word2ph[i] * 2
        word2ph[0] += 1
    bert = get_bert(norm_text, word2ph, language_str, device)
    del word2ph
    assert bert.shape[-1] == len(phone), phone

    if language_str == "ZH":
        bert = bert
        ja_bert = torch.zeros(768, len(phone))
    elif language_str == "JA":
        ja_bert = bert
        bert = torch.zeros(1024, len(phone))
    else:
        bert = torch.zeros(1024, len(phone))
        ja_bert = torch.zeros(768, len(phone))

    assert bert.shape[-1] == len(
        phone
    ), f"Bert seq len {bert.shape[-1]} != {len(phone)}"

    phone = torch.LongTensor(phone)
    tone = torch.LongTensor(tone)
    language = torch.LongTensor(language)
    return bert, ja_bert, phone, tone, language

def extrac(text):
    text = re.sub("<[^>]*>","",text)
    result_list = re.split(r'\n', text)
    final_list = []
    for i in result_list:
        i = i.replace('\n','').replace(' ','')
        #Current length of single sentence: 20 
        if len(i)>1:
            if len(i) > 20:
                try:
                    cur_list = re.split(r'。|！', i)
                    for i in cur_list:
                        if len(i)>1:
                            final_list.append(i+'。')
                except:
                    pass
            else:
                final_list.append(i)

    final_list = [x for x in final_list if x != '']
    return final_list


def infer(text, sdp_ratio, noise_scale, noise_scale_w, length_scale, sid, language):
    global net_g
    bert, ja_bert, phones, tones, lang_ids = get_text(text, language, hps)
    with torch.no_grad():
        x_tst = phones.to(device).unsqueeze(0)
        tones = tones.to(device).unsqueeze(0)
        lang_ids = lang_ids.to(device).unsqueeze(0)
        bert = bert.to(device).unsqueeze(0)
        ja_bert = ja_bert.to(device).unsqueeze(0)
        x_tst_lengths = torch.LongTensor([phones.size(0)]).to(device)
        del phones
        speakers = torch.LongTensor([hps.data.spk2id[sid]]).to(device)
        audio = (
            net_g.infer(
                x_tst,
                x_tst_lengths,
                speakers,
                tones,
                lang_ids,
                bert,
                ja_bert,
                sdp_ratio=sdp_ratio,
                noise_scale=noise_scale,
                noise_scale_w=noise_scale_w,
                length_scale=length_scale,
            )[0][0, 0]
            .data.cpu()
            .float()
            .numpy()
        )
        del x_tst, tones, lang_ids, bert, x_tst_lengths, speakers
        return audio


def tts_fn(
    text, speaker, sdp_ratio, noise_scale, noise_scale_w, length_scale
):
    a = ['【','[','(','（']
    b = ['】',']',')','）']
    for i in a:
        text = text.replace(i,'<')
    for i in b:
        text = text.replace(i,'>')
    final_list = extrac(text.replace('“','').replace('”',''))
    audio_fin = []
    for sentence in final_list:
        with torch.no_grad():
            audio = infer(
                sentence,
                sdp_ratio=sdp_ratio,
                noise_scale=noise_scale,
                noise_scale_w=noise_scale_w,
                length_scale=length_scale,
                sid=speaker,
                language= "JP" if is_japanese(text) else "ZH",
            )
        audio_fin.append(audio)
    write("temp.wav", 44100, np.concatenate(audio_fin))
    return "success"

app = Flask(__name__)
CORS(app)

@app.route('/tts')
@app.route('/tts')
def tts_api():
    # 这些没必要改
    text = request.args.get('text')
    speaker = request.args.get('speaker')
    sdp_ratio = float(request.args.get('sdp_ratio', 0.2))
    noise_scale = float(request.args.get('noise_scale', 0.6))
    noise_scale_w = float(request.args.get('noise_scale_w', 0.8))
    length_scale = float(request.args.get('length_scale', 1))
    # 修改说话人
    try:
        status = tts_fn(text, speaker='彩', sdp_ratio=0.2, noise_scale=0.6, noise_scale_w=0.8, length_scale=1)
        with open('temp.wav','rb') as bit:
            wav_bytes = bit.read()
        
        headers = {
                'Content-Type': 'audio/wav',
                'Text': status.encode('utf-8')}
        return wav_bytes, 200, headers
    #若生成音频失败直接读取上一次的
    except:
        with open('temp.wav','rb') as bit:
            wav_bytes = bit.read()
        
        headers = {
                'Content-Type': 'audio/wav',
                'Text': 'failed'}
        return wav_bytes, 200, headers

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-m", "--model", default="path/to/model.pth", help="path of your model"
    )
    parser.add_argument(
        "-c",
        "--config",
        default="path/to/config.json",
        help="path of your config file",
    )
    parser.add_argument(
        "--share", default=True, help="make link public", action="store_true"
    )
    parser.add_argument(
        "-d", "--debug", action="store_true", help="enable DEBUG-LEVEL log"
    )

    args = parser.parse_args()
    if args.debug:
        logger.info("Enable DEBUG-LEVEL log")
        logging.basicConfig(level=logging.DEBUG)
    hps = utils.get_hparams_from_file(args.config)

    device = (
        "cuda:0"
        if torch.cuda.is_available()
        else (
            "mps"
            if sys.platform == "darwin" and torch.backends.mps.is_available()
            else "cpu"
        )
    )
    net_g = SynthesizerTrn(
        len(symbols),
        hps.data.filter_length // 2 + 1,
        hps.train.segment_size // hps.data.hop_length,
        n_speakers=hps.data.n_speakers,
        **hps.model,
    ).to(device)
    _ = net_g.eval()

    _ = utils.load_checkpoint(args.model, net_g, None, skip_optimizer=True)

    app.run(host="0.0.0.0", port=5000)

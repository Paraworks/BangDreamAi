import argparse
import os
from pathlib import Path

import logging
import re_matching

from flask import Flask, request, jsonify
from flask_cors import CORS

logging.getLogger("numba").setLevel(logging.WARNING)
logging.getLogger("markdown_it").setLevel(logging.WARNING)
logging.getLogger("urllib3").setLevel(logging.WARNING)
logging.getLogger("matplotlib").setLevel(logging.WARNING)

logging.basicConfig(
    level=logging.INFO, format="| %(name)s | %(levelname)s | %(message)s"
)

logger = logging.getLogger(__name__)
import librosa
import numpy as np
import torch
import torch.nn as nn
from torch.utils.data import Dataset
from torch.utils.data import DataLoader, Dataset
from tqdm import tqdm
from transformers import Wav2Vec2Processor
from transformers.models.wav2vec2.modeling_wav2vec2 import (
    Wav2Vec2Model,
    Wav2Vec2PreTrainedModel,
)

import utils
from config import config

import torch
import commons
from text import cleaned_text_to_sequence, get_bert
from emo_gen import process_func, EmotionModel, Wav2Vec2Processor, Wav2Vec2Model, Wav2Vec2PreTrainedModel, RegressionHead
from text.cleaner import clean_text
import utils

from models import SynthesizerTrn
from text.symbols import symbols
import sys

from scipy.io.wavfile import write

net_g = None

device = (
        "cuda:0"
        if torch.cuda.is_available()
        else (
            "mps"
            if sys.platform == "darwin" and torch.backends.mps.is_available()
            else "cpu"
        )
    )

def get_net_g(model_path: str, version: str, device: str, hps):
    net_g = SynthesizerTrn(
        len(symbols),
        hps.data.filter_length // 2 + 1,
        hps.train.segment_size // hps.data.hop_length,
        n_speakers=hps.data.n_speakers,
        **hps.model,
    ).to(device)
    _ = net_g.eval()
    _ = utils.load_checkpoint(model_path, net_g, None, skip_optimizer=True)
    return net_g

def get_text(text, language_str, hps, device):
    norm_text, phone, tone, word2ph = clean_text(text, language_str)
    phone, tone, language = cleaned_text_to_sequence(phone, tone, language_str)
    #print(text)
    if hps.data.add_blank:
        phone = commons.intersperse(phone, 0)
        tone = commons.intersperse(tone, 0)
        language = commons.intersperse(language, 0)
        for i in range(len(word2ph)):
            word2ph[i] = word2ph[i] * 2
        word2ph[0] += 1
    bert_ori = get_bert(norm_text, word2ph, language_str, device)
    del word2ph
    assert bert_ori.shape[-1] == len(phone), phone

    if language_str == "ZH":
        bert = bert_ori
        ja_bert = torch.zeros(1024, len(phone))
        en_bert = torch.zeros(1024, len(phone))
    elif language_str == "JP":
        bert = torch.zeros(1024, len(phone))
        ja_bert = bert_ori
        en_bert = torch.zeros(1024, len(phone))
    elif language_str == "EN":
        bert = torch.zeros(1024, len(phone))
        ja_bert = torch.zeros(1024, len(phone))
        en_bert = bert_ori
    else:
        raise ValueError("language_str should be ZH, JP or EN")

    assert bert.shape[-1] == len(
        phone
    ), f"Bert seq len {bert.shape[-1]} != {len(phone)}"

    phone = torch.LongTensor(phone)
    tone = torch.LongTensor(tone)
    language = torch.LongTensor(language)
    return bert, ja_bert, en_bert, phone, tone, language

def get_emo_(reference_audio, emotion):

    if (emotion == 10 and reference_audio):
        emo = torch.from_numpy(get_emo(reference_audio))
    else:
        emo = torch.Tensor([emotion])

    return emo

def get_emo(path):
    wav, sr = librosa.load(path, 16000)
    device = config.bert_gen_config.device
    return process_func(
        np.expand_dims(wav, 0).astype(np.float64),
        sr,
        emotional_model,
        emotional_processor,
        device,
        embeddings=True,
    ).squeeze(0)

def infer(
    text,
    sdp_ratio,
    noise_scale,
    noise_scale_w,
    length_scale,
    sid,
    reference_audio=None,
    emotion=0,
):

    language= 'JP' if is_japanese(text) else 'ZH'
    bert, ja_bert, en_bert, phones, tones, lang_ids = get_text(
        text, language, hps, device
    )
    emo = get_emo_(reference_audio, emotion)
    with torch.no_grad():
        x_tst = phones.to(device).unsqueeze(0)
        tones = tones.to(device).unsqueeze(0)
        lang_ids = lang_ids.to(device).unsqueeze(0)
        bert = bert.to(device).unsqueeze(0)
        ja_bert = ja_bert.to(device).unsqueeze(0)
        en_bert = en_bert.to(device).unsqueeze(0)
        x_tst_lengths = torch.LongTensor([phones.size(0)]).to(device)
        emo = emo.to(device).unsqueeze(0)
        print(emo)
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
                en_bert,
                emo,
                sdp_ratio=sdp_ratio,
                noise_scale=noise_scale,
                noise_scale_w=noise_scale_w,
                length_scale=length_scale,
            )[0][0, 0]
            .data.cpu()
            .float()
            .numpy()
        )
        del x_tst, tones, lang_ids, bert, x_tst_lengths, speakers, ja_bert, en_bert, emo
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
        write("temp.wav", 44100, audio)
        return 'success'

def is_japanese(string):
        for ch in string:
            if ord(ch) > 0x3040 and ord(ch) < 0x30FF:
                return True
        return False

def loadmodel(model):
    _ = net_g.eval()
    _ = utils.load_checkpoint(model, net_g, None, skip_optimizer=True)
    return "success"

app = Flask(__name__)
CORS(app)
@app.route('/tts')

def tts():
    # 这些没必要改
    speaker = request.args.get('speaker')
    sdp_ratio = float(request.args.get('sdp_ratio', 0.2))
    noise_scale = float(request.args.get('noise_scale', 0.6))
    noise_scale_w = float(request.args.get('noise_scale_w', 0.8))
    length_scale = float(request.args.get('length_scale', 1))
    text = request.args.get('text')
    status = infer(text, sdp_ratio=sdp_ratio, noise_scale=noise_scale, noise_scale_w=noise_scale_w, length_scale=length_scale,sid = speaker, reference_audio=None, emotion=0)
    with open('temp.wav','rb') as bit:
        wav_bytes = bit.read()
    
    headers = {
            'Content-Type': 'audio/wav',
            'Text': status.encode('utf-8')}
    return wav_bytes, 200, headers


if __name__ == "__main__":
    emotional_model_name = "./emotional/wav2vec2-large-robust-12-ft-emotion-msp-dim"
    REPO_ID = "audeering/wav2vec2-large-robust-12-ft-emotion-msp-dim"
    emotional_processor = Wav2Vec2Processor.from_pretrained(emotional_model_name)
    emotional_model = EmotionModel.from_pretrained(emotional_model_name).to(device)
    languages = [ "Auto", "ZH", "JP"]
    modelPaths = []
    for dirpath, dirnames, filenames in os.walk("Data/Bushiroad/models/"):
        for filename in filenames:
            modelPaths.append(os.path.join(dirpath, filename))
    hps = utils.get_hparams_from_file('Data/Bushiroad/configs/config.json')
    net_g = get_net_g(
        model_path=modelPaths[-1], version="2.1", device=device, hps=hps
    )
    speaker_ids = hps.data.spk2id
    speakers = list(speaker_ids.keys())
    app.run(host="0.0.0.0", port=5000)
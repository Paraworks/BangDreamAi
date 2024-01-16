import random
import json

def get_model_data(model_path):
    """读取模型文件并返回动作和表情列表"""
    try:
        with open('BangDreamAIFlask/'+model_path, 'r') as file:
            model_data = json.load(file)
            motions = list(model_data.get('motions', {}).keys())
            expressions = [exp['name'] for exp in model_data.get('expressions', [])]
            return motions, expressions
    except Exception as e:
        print(f"Error reading model file: {e}")
        return [], []

def emotion_classifier(text, motions,expressions):
    motion = random.choice(motions) if motions else None
    expression = random.choice(expressions) if expressions else None
    emotion = text
    return emotion,motion,expression

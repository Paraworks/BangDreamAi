import os
import requests

def get_band_list():
    model_dir = 'static/Resources'  # 模型所在目录
    band_list = {}

    # 遍历模型目录
    for root, dirs, files in os.walk(model_dir):
        for file in files:
            if file == 'model.json':
                model_path = os.path.join(root, file).replace("\\", "/")
                parts = model_path.split('/')
                if len(parts) >= 5:
                    band = parts[2]
                    member = parts[3]
                    model_name = parts[4]
                    if band not in band_list:
                        band_list[band] = {}
                    if member not in band_list[band]:
                        band_list[band][member] = {'id': parts[3], 'models': []}
                    band_list[band][member]['models'].append(model_path)
    
    return band_list

def get_model_data(model_path):
    """读取模型文件并返回动作和表情列表"""
    try:
        model_data = requests.get(model_path)
        if model_data.status_code == 200:
            model_data = model_data.json()
            motions = list(model_data.get('motions', {}).keys())
            expressions = [exp['name'] for exp in model_data.get('expressions', [])]
            return motions, expressions
    except Exception as e:
        print(f"Error reading model file: {e}")
        return [], []

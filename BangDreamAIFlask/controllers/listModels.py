from flask import  jsonify, request
from . import controllers
import os

BandList = {
    "PoppinParty":{
        "香澄":{"id": "001","models": []},
        "たえ":{"id": "002","models": []},
        "りみ":{"id": "003","models": []},
        "沙綾":{"id": "004","models": []},
        "有咲":{"id": "005","models": []},
        },
    "Afterglow":{
        "蘭":{"id": "006","models": []},
        "モカ":{"id": "007","models": []},
        "ひまり":{"id": "008","models": []},
        "巴":{"id": "009","models": []},
        "つぐみ":{"id": "010","models": []},
        },
    "HelloHappyWorld":{
        "こころ":{"id": "011","models": []},
        "薫":{"id": "012","models": []},
        "はぐみ":{"id": "013","models": []},
        "花音":{"id": "014","models": []},
        "美咲":{"id": "015","models": []},
        },
    "PastelPalettes":{
        "彩":{"id": "016","models": []},
        "日菜":{"id": "017","models": []},
        "千聖":{"id": "018","models": []},
        "麻弥":{"id": "019","models": []},
        "イヴ":{"id": "020","models": []},
        },
    "Roselia":{
        "友希那":{"id": "021","models": []},
        "紗夜":{"id": "022","models": []},
        "リサ":{"id": "023","models": []},
        "あこ":{"id": "024","models": []},
        "燐子":{"id": "025","models": []},
        },

}

model_dir = 'BangDreamAIFlask/static/Resources'  # 模型所在目录
model_paths = []  # 存储模型路径的列表

# 遍历模型目录
for root, dirs, files in os.walk(model_dir):
    for file in files:
        if file.endswith('.json'):  # 假设模型文件以 .json 结尾
            path = os.path.join(root, file)
            model_paths.append(os.path.join(path.replace("\\", "/")))

for model in model_paths:
    model_id = model.split('_')[0].split('/')[-1]
    for band in BandList:
        for member in BandList[band]:
            if BandList[band][member]['id'] == model_id:
                BandList[band][member]['models'].append(model.replace('BangDreamAIFlask','..'))

@controllers.route('/listModels')
def list_models():

    return jsonify(BandList)

'''
@controllers.route('/listModels')
def list_models():
    return jsonify(BandList)
'''
        
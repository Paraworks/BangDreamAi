from flask import  jsonify, request
from . import controllers


@controllers.route('/listModels')
def list_models():
    model_dir = 'static/Resources'  # 模型所在目录
    model_paths = []  # 存储模型路径的列表

    # 遍历模型目录
    for root, dirs, files in os.walk(model_dir):
        for file in files:
            if file.endswith('.json'):  # 假设模型文件以 .json 结尾
                path = os.path.join(root, file)
                model_paths.append(path)

    return jsonify(model_paths)
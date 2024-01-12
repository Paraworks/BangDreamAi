from flask import  jsonify, request
from . import controllers
import os

@controllers.route('/listModels')
def list_models():
    model_paths = ["static/Resources/001_2018_halloween/model.json","static/Resources/001_school_summer/model.json"]  # 存储模型路径的列表
    return jsonify(model_paths)
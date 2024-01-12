from flask import Blueprint

# 生成蓝图
controllers = Blueprint('controllers', __name__)
from . import content, listModels, sentence, session, task  

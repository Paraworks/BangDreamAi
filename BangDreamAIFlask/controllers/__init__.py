from flask import Blueprint

# 生成蓝图
views = Blueprint('controllers', __name__)
from . import content, listModels, sentence, session, response  

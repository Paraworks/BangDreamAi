from flask import Blueprint

# 生成蓝图
views = Blueprint('views', __name__)
from . import index
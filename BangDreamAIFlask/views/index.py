from flask import render_template
from . import views

@views.route('/')
def index():
    return render_template('front/index.html')

@views.route('/cate/')
def cate():
    return render_template('front/cate.html')

@views.route('/detail/')
def detail():
    return render_template('front/detail.html')
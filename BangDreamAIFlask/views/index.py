from flask import render_template
from . import views

@views.route('/')
def index():
    return render_template('front/base.html')
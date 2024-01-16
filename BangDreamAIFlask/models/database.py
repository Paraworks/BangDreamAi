from flask_sqlalchemy import SQLAlchemy
from flask import Flask
import json

db = SQLAlchemy()

class Content(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sessionID = db.Column(db.String(80), nullable=False)
    taskID = db.Column(db.String(120), nullable=False)
    sentenceId = db.Column(db.Integer, nullable=False)
    modelPath = db.Column(db.String(120), nullable=True)
    ttsApiBaseUrl = db.Column(db.String(120), nullable=True)
    textApiBaseUrl = db.Column(db.String(120), nullable=True)
    text = db.Column(db.JSON, nullable=True)
    frequence = db.Column(db.Float, nullable=True)
    volum = db.Column(db.Integer, nullable=True)
    duration = db.Column(db.Float, nullable=True)
    background = db.Column(db.String(120), nullable=True)
    speaker = db.Column(db.String(50), nullable=True)
    band = db.Column(db.String(50), nullable=True)
    position = db.Column(db.String(50), nullable=True)

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sessionID = db.Column(db.String(80), nullable=False)
    taskID = db.Column(db.String(120), nullable=False)
    contents = db.Column(db.JSON, nullable=True)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sessionID = db.Column(db.String(80), nullable=False)
    tasks = db.Column(db.JSON, nullable=True)

class Database:
    def __init__(self, app=None):
        self.db = db
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SQLALCHEMY_POOL_SIZE'] = 20  # Example pool size
        self.db.init_app(app)
        with app.app_context():
            self.db.create_all()

    def get_model(self, table_name):
        if table_name == 'sentence':
            return Sentence  # 假设 Sentence 是一个 SQLAlchemy 模型
        elif table_name == 'content':
            return Content  # 假设 Content 是一个 SQLAlchemy 模型
        else:
            raise ValueError("Invalid table name")

    def find(self, model, criteria):
        instance = model.query.filter_by(**criteria).first()
        if instance:
            return {column.name: getattr(instance, column.name) for column in instance.__table__.columns}
        return None

    def insert(self, model, data):
        instance = model(**data)
        self.db.session.add(instance)
        self.db.session.commit()

    def update(self, model, primary_keys, new_data):
        instance = model.query.filter_by(**primary_keys).first()
        if instance:
            for key, value in new_data.items():
                setattr(instance, key, value)
            self.db.session.commit()

    def delete(self, model, criteria):
        model.query.filter_by(**criteria).delete()
        self.db.session.commit()

import sqlite3
import json
from flask import g

class Database:
    def __init__(self, app=None):
        self.app = app
        if app is not None:
            self.init_app(app)

    def init_app(self, app):
        self.db_name = 'test.db'
        app.teardown_appcontext(self.teardown)

    def get_db(self):
        if 'db' not in g:
            g.db = sqlite3.connect(self.db_name)
            g.cursor = g.db.cursor()
        return g.db, g.cursor

    def teardown(self, exception):
        db = g.pop('db', None)
        if db is not None:
            db.close()

    def create_table(self, table_name):
        conn, cursor = self.get_db()
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} (key TEXT PRIMARY KEY, value TEXT)")

    def insert(self, table_name, key, value):
        conn, cursor = self.get_db()
        cursor.execute(f"SELECT key FROM {table_name} WHERE key = ?", (key,))
        result = cursor.fetchone()
        if result is None:
            # Key does not exist, insert new key-value pair
            cursor.execute(f"INSERT INTO {table_name} VALUES (?, ?)", (key, json.dumps(value)))
        else:
            # Key exists, update value
            cursor.execute(f"UPDATE {table_name} SET value = ? WHERE key = ?", (json.dumps(value), key))
        conn.commit()

    def delete(self, table_name, key):
        conn, cursor = self.get_db()
        cursor.execute(f"DELETE FROM {table_name} WHERE key = ?", (key,))
        conn.commit()

    def update(self, table_name, key, value):
        conn, cursor = self.get_db()
        cursor.execute(f"UPDATE {table_name} SET value = ? WHERE key = ?", (json.dumps(value), key))
        conn.commit()

    def read(self, table_name, key):
        conn, cursor = self.get_db()
        cursor.execute(f"SELECT value FROM {table_name} WHERE key = ?", (key,))
        result = cursor.fetchone()
        return None if result is None else json.loads(result[0])

    def close(self):
        conn, cursor = self.get_db()
        conn.close()
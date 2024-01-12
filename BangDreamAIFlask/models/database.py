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

    def create_table(self, table_name, data):
        conn, cursor = self.get_db()
        columns = ", ".join([f"{key} {self.get_sqlite_type(value)}" for key, value in data.items()])
        cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} ({columns})")
        conn.commit()

    def get_sqlite_type(self, value):
        if isinstance(value, int):
            return 'INTEGER'
        elif isinstance(value, float):
            return 'REAL'
        else:
            return 'TEXT'  # 包括字符串和 JSON 字符串

    def find(self, table_name, criteria):
        conn, cursor = self.get_db()
        query = f"SELECT * FROM {table_name} WHERE " + " AND ".join([f"{k} = ?" for k in criteria])
        cursor.execute(query, tuple(criteria.values()))
        result = cursor.fetchone()
        if result:
            # Get column names from cursor description
            column_names = [column[0] for column in cursor.description]
            # Pair column names with result values and convert to dictionary
            result = dict(zip(column_names, result))
        return result
    
    def insert(self, table_name, data):
        conn, cursor = self.get_db()
        processed_data = {k: json.dumps(v) if isinstance(v, (list, dict)) else v for k, v in data.items()}
        keys = ", ".join(processed_data.keys())
        question_marks = ", ".join(["?"] * len(processed_data))
        query = f"INSERT INTO {table_name} ({keys}) VALUES ({question_marks})"
        cursor.execute(query, tuple(processed_data.values()))
        conn.commit()

    def update(self, table_name, primary_keys, new_data):
        conn, cursor = self.get_db()
        processed_data = {k: json.dumps(v) if isinstance(v, (list, dict)) else v for k, v in new_data.items()}
        update_clause = ", ".join([f"{k} = ?" for k in processed_data])
        where_clause = " AND ".join([f"{k} = ?" for k in primary_keys])
        query = f"UPDATE {table_name} SET {update_clause} WHERE {where_clause}"
        cursor.execute(query, tuple(processed_data.values()) + tuple(primary_keys.values()))
        conn.commit()
    
    def delete(self, table_name, criteria):
        conn, cursor = self.get_db()
        query = f"DELETE FROM {table_name} WHERE " + " AND ".join([f"{k} = ?" for k in criteria])
        cursor.execute(query, tuple(criteria.values()))
        conn.commit()

    def close(self):
        conn, cursor = self.get_db()
        conn.close()

    def is_json(self, myjson):
        try:
            json_object = json.loads(myjson)
        except ValueError as e:
            return False
        return True
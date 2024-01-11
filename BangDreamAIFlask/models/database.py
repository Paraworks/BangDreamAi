import sqlite3
import json

class Database:
    def __init__(self, db_name):
        self.conn = sqlite3.connect(db_name)
        self.cursor = self.conn.cursor()

    def create_table(self, table_name):
        self.cursor.execute(f"CREATE TABLE IF NOT EXISTS {table_name} (key TEXT PRIMARY KEY, value TEXT)")

    def insert(self, table_name, key, value):
        self.cursor.execute(f"INSERT INTO {table_name} VALUES (?, ?)", (key, json.dumps(value)))
        self.conn.commit()

    def delete(self, table_name, key):
        self.cursor.execute(f"DELETE FROM {table_name} WHERE key = ?", (key,))
        self.conn.commit()

    def update(self, table_name, key, value):
        self.cursor.execute(f"UPDATE {table_name} SET value = ? WHERE key = ?", (json.dumps(value), key))
        self.conn.commit()

    def read(self, table_name, key):
        self.cursor.execute(f"SELECT value FROM {table_name} WHERE key = ?", (key,))
        return json.loads(self.cursor.fetchone()[0])

    def close(self):
        self.conn.close()
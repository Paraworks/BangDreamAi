import unittest
from BangDreamAIFlask.models.database import Database
from BangDreamAIFlask.models.config import Config
from flask import Flask
import json

class TestDatabase(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)
        with self.app.app_context():
            self.db = Database(self.app)
            self.db.create_table('test')
            self.config = Config('config.json')

    def test_insert_and_read(self):
        with self.app.app_context():
            for key, value in self.config.__dict__.items():
                self.db.insert('test', key, value)
            for key, value in self.config.__dict__.items():
                self.assertEqual(self.db.read('test', key), value)

    def test_delete_and_read(self):
        with self.app.app_context():
            for key in self.config.__dict__.keys():
                self.db.delete('test', key)
                result = self.db.read('test', key)
                self.assertIsNone(result if result is None else json.loads(result))

    def test_update_and_read(self):
        with self.app.app_context():
            for key, value in self.config.__dict__.items():
                new_value = str(value) + '_updated'
                self.db.update('test', key, new_value)
                self.assertEqual(self.db.read('test', key), new_value)

    def tearDown(self):
        with self.app.app_context():
            self.db.close()

if __name__ == '__main__':
    unittest.main()
from BangDreamAIFlask import create_app
from flask import render_template
port = 5000
app = create_app()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)

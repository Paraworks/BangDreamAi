from BangDreamAIFlask import create_app

port = 5000
app = create_app()

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=port,debug=True)

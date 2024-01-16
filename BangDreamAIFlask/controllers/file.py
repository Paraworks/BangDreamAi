from flask import  jsonify, request
from . import controllers

@controllers.route('/file/<session_id>', methods=['GET', 'POST'])
def file(session_id):
    if request.method == 'POST':
        #读取header
        filename = request.headers.get('uploadfile')
        #创建文件夹并且将接受到的文件保存其中
        f = request.files['file']
        f.save(f'BangDreamAIFlask/data/{session_id}/{filename}')
        return jsonify({"success": True})
    filename = request.args.get('filename')
    with open (f'BangDreamAIFlask/data/{session_id}/{filename}','rb') as f:
        file = f.read()
        headers = {
            'Content-Type': file.split('.')[-1],
            'Text': filename .encode('utf-8')
            }
    return file, 200, headers
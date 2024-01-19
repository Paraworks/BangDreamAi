from flask import  jsonify, request, send_file
from . import controllers
from os import makedirs, path

@controllers.route('/upload/<session_id>', methods=['POST'])
def upload(session_id):
    directory = f'data/{session_id}'
    filename = request.headers.get('uploadfile')
    if not path.exists(directory):
        makedirs(directory)  # 创建目录

    file = request.files['file']
    file.save(f'{directory}/{filename}')
    return jsonify({"success": True})
    


@controllers.route('/file/<session_id>/<file_name>', methods=['GET'])
def file(session_id,file_name):
    if path.exists(f'data/{session_id}/{file_name}'):
        with open (f'data/{session_id}/{file_name}','rb') as f:
            file = f.read()
            if file_name.endswith('wav'):
                headers = {
                    'Content-Type': 'audio/wav',
                    'Text': file_name .encode('utf-8')
                    }
            elif file_name.endswith('png'):
                headers = {
                    'Content-Type': 'image/png',
                    'Text': file_name .encode('utf-8')
                    }
            elif file_name.endswith('jpg'):
                headers = {
                    'Content-Type': 'image/jpg',
                    'Text': file_name .encode('utf-8')
                    }
        return file, 200, headers
    else:
        return jsonify({"success": False})

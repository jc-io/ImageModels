from flask import Flask, jsonify, request
import json
import base64
from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

UPLOAD_FOLDER = './uploads'

app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/upload", methods=['post'])
def test_image():
    try:

        image = request.files['image']
        image.save(os.path.join(app.config['UPLOAD_FOLDER'],
        secure_filename(image.filename)));
        ##image.save("/.")

        return jsonify({'message': 'File uploaded successfully'})

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000)

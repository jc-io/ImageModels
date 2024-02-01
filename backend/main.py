from flask import Flask, jsonify, request
import json
from captionGen import captionGen
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

UPLOAD_FOLDER = 'uploads'



app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
         

@app.route("/")
def hello_world():
    return "Hello, World!"

@app.route("/upload", methods=['post'])
def test_image():
    try:
        try: 
          imagecaption = request.form.get('caption');
          print("Caption to use: " + str(imagecaption));
        except Exception as e:
          print("Unable to determine caption");
        
        uploaded_files = request.files.getlist('file') 
        caption = captionGen()
        for file in uploaded_files:
          print("Saving File Name: "+file.filename);
          file.save(os.path.join(app.config['UPLOAD_FOLDER'],file.filename));
          # pil_img = Image.open(file); #uncommet to see images pop up
          # pil_img.show();
          secure_filename(file.filename);
          pathurl = os.path.join(app.config['UPLOAD_FOLDER'],file.filename);
          print(pathurl)
          captionGenerated = caption.predict(pathurl)
        ##image.save("/.")
        res = {'message': 'File uploaded successfully',"caption":captionGenerated}
        res_message = jsonify(res);
        return res_message;

    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000, debug=True)







    

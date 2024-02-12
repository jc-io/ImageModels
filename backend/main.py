from flask import Flask, jsonify, request
import json
from imageGen import imageGen
import base64
from captionGen import captionGen
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

UPLOAD_FOLDER = 'uploads'
GENERATED_FOLDER = 'generated';


app = Flask(__name__)
CORS(app)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['GENERATED_FOLDER'] = GENERATED_FOLDER


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
@app.route("/generate", methods=['post'])
def generate_image():
    try:
        prompt = request.form.get('prompt');
        print("Recieved prompt: " + prompt)
        #to implement: bool(slow_model) from frontend to pick between fast and slow model?
        #right now set to default fast model
        slow_model = False
        generator = imageGen(slow_model);
        image = generator.generate(prompt);
        image.save(os.path.join(app.config['GENERATED_FOLDER'],"generated_image1.jpg"))
        images = []
        for i in range(1, 2):  # Assuming there are three images named image1.jpg, image2.jpg, and image3.jpg
          image_path = os.path.join(app.config['GENERATED_FOLDER'],f"generated_image{i}.jpg");
          with open(image_path, 'rb') as file:
              image_data = base64.b64encode(file.read()).decode('utf-8')
              images.append({'image_data': image_data})
        print(len(images))
        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images});
        
    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000, debug=True)







    

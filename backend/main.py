from flask import Flask, jsonify, request
import json
from PIL import Image
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
          print(captionGenerated);
          funnycaption = caption.makeFunny(captionGenerated);
        ##image.save("/.")
        res = {'message': 'File uploaded successfully',"caption":funnycaption}
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
        generator = imageGen();
        image = generator.generate(prompt);
        images = []
        raw_image = Image.open(image).convert('RGB')
        image_byte_array = raw_image.tobytes()

        # Encode the byte array to base64
        base64_encoded_image = base64.b64encode(image_byte_array)

        # Convert the base64 bytes to a string (if needed)
        base64_encoded_image_string = base64_encoded_image.decode('utf-8')
        # with open(image, "rb") as imageFile:
        images.append({'image_data': base64_encoded_image_string});
        # image.save(os.path.join(app.config['GENERATED_FOLDER'],"generated_image1.jpg"))
 

        # for i in range(1, 2):  # Assuming there are three images named image1.jpg, image2.jpg, and image3.jpg
        #   image_path = os.path.join(app.config['GENERATED_FOLDER'],f"generated_image{i}.jpg");
        #   with open(image_path, 'rb') as file:
        #       image_data = base64.b64encode(file.read()).decode('utf-8')
        #       images.append({'image_data': image_data})
        # print(len(images))
        return jsonify({'message': 'File uploaded successfully','prompt':prompt,'images':images});
        
    except Exception as e:
        print(str(e));
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
   app.run(port=5000, debug=True)







    

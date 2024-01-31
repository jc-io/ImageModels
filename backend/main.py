from flask import Flask, jsonify, request
import json
# from PIL import Image #uncomment if u want to see images pop up

from flask_cors import CORS
from werkzeug.utils import secure_filename

import os

UPLOAD_FOLDER = 'uploads'

from PIL import Image
import requests
import torch
from torchvision import transforms
from torchvision.transforms.functional import InterpolationMode

device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')

   
def load_demo_image(image_size,device,imageurl):

    #replace with url we can use s3
    raw_image = Image.open(imageurl).convert('RGB')   

    w,h = raw_image.size
    # Image.open(raw_image.resize((w//5,h//5)))
    
    transform = transforms.Compose([
        transforms.Resize((image_size,image_size),interpolation=InterpolationMode.BICUBIC),
        transforms.ToTensor(),
        transforms.Normalize((0.48145466, 0.4578275, 0.40821073), (0.26862954, 0.26130258, 0.27577711))
        ]) 
    image = transform(raw_image).unsqueeze(0).to(device)   
    return image
class captionGen:
    def __init__(self):
        pass;
    #change to imagepath
    def predict(self, imageurl):
        from models.blip import blip_decoder

        image_size = 384
        image = load_demo_image(image_size=image_size, device=device,imageurl=imageurl)

        model_url = 'https://storage.googleapis.com/sfr-vision-language-research/BLIP/models/model_base_capfilt_large.pth'
            
        model = blip_decoder(pretrained=model_url, image_size=image_size, vit='base')
        model.eval()
        model = model.to(device)

        with torch.no_grad():
            # beam search
            caption = model.generate(image, sample=False, num_beams=3, max_length=20, min_length=5) 
            # nucleus sampling
            # caption = model.generate(image, sample=True, top_p=0.9, max_length=20, min_length=5) 
            print('caption: '+caption[0])
            return caption[0]

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







    
